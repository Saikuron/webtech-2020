import {useContext, useRef, useState, useCallback, useEffect} from 'react';
import axios from 'axios';
/** @jsx jsx */
import { jsx } from '@emotion/core'
// Layout
import { useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
// Local
import Form from './channel/Form'
import List from './channel/List'
import Context from './Context'
import { useParams } from 'react-router-dom'

const useStyles = (theme) => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflowX: 'auto',
  },
  fab: {
    position: 'absolute !important',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabDisabled: {
    display: 'none !important',
  }
})

export default () => {
  //const history = useHistory()
  const { id } = useParams()
  const {oauth, channels} = useContext(Context)
  const channel = channels.find( channel => channel.id === id)
  if(!channel) {
    //history.push('/oups')
    return <div/>
  }
  const styles = useStyles(useTheme())
  const listRef = useRef()
  const channelId = useRef()
  const [messages, setMessages] = useState([]) 
  const [scrollDown, setScrollDown] = useState(false)
  const fetchMessages = async () => {
    setMessages([])
    const {data: messages} = await axios.get(`http://localhost:3001/channels/${channel.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${oauth.access_token}`
      }
    })
    setMessages(messages)
    if(listRef.current){
      listRef.current.scroll()
    }
  }
  const addMessage = (message) => {
    fetchMessages()
  }
  const onScrollDown = (scrollDown) => {
    setScrollDown(scrollDown)
  }
  if(channelId.current !== channel.id){
    fetchMessages()
    channelId.current = channel.id
  }
  const onClickScroll = () => {
    listRef.current.scroll()
  }
  return (
    <div css={styles.root}>
      <List
        channel={channel}
        messages={messages}
        onScrollDown={onScrollDown}
        fetchMessages={fetchMessages}
        ref={listRef}
        fetchMessages={fetchMessages}
      />
      <Form addMessage={addMessage} channel={channel} />
      <Fab
        color="primary"
        aria-label="Latest messages"
        css={[styles.fab, scrollDown || styles.fabDisabled]}
        onClick={onClickScroll}
      >
        <ArrowDropDownIcon />
      </Fab>
    </div>
  );
}
