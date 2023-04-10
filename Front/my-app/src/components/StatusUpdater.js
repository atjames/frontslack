import React, {useEffect, useState} from 'react';
import { useFrontContext } from '../providers/frontContext';
import { Button, Input} from '@frontapp/ui-kit';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'
import './EmojiPicker.css';
const emojiDictionary = require("emoji-dictionary");


/* Things to add:

      -Give option to set duration for Slack Status

*/

function Tutorial() {

  const context = useFrontContext();
  const [disabled1, setDisabled1] = useState(false);
  const [disabled2, setDisabled2] = useState(false);
  const [slackStatus,setSlackStatus] = useState('');
  const [frontStatusCheck, setFrontStatusCheck] = useState(false);
  const [currentSlackStatus,setCurrentSlackStatus] = useState('');
  const [currentEmoji,setCurrentEmoji] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [nativeEmoji, setSelectedEmoji2] = useState(null);
  const frontuserID = context.teammate.id;
  const webHookURL = "http://localhost:3000" 


  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setDisabled1(false);
    }, 2000);
    const timeout2 = setTimeout(() => {
      setDisabled2(false);
    }, 2000);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    }
  }, [disabled1, disabled2]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(webHookURL + '/current');
        const data = await response.json();
        setCurrentSlackStatus(data.status_text);
        setCurrentEmoji(data.status_emoji);
      } catch (error) {
        console.log(error);
      }
    };
  
    // Fetch status initially and then every 3 seconds
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
  
    // Clean up the interval to avoid memory leaks
    return () => clearInterval(interval);
  }, []);



  const handleClick = async () => {
      if(disabled1){
        return;
      }
        setDisabled1(true); 
        console.log({selectedEmoji});
          const response = await fetch(webHookURL+'/slackStatus', {
            method: 'POST',
            body: JSON.stringify({slack_status: slackStatus, emoji: selectedEmoji}), 
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            console.error('Failed to post data to webhook.');
          }
          
          const response2 = await fetch(webHookURL+'/frontStatus', {
            method: 'POST',
            body: JSON.stringify({id: frontuserID, front_status: !frontStatusCheck}),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response2.ok) {
            console.error('Failed to post data to webhook.');
          }
          setSlackStatus("");
          setSelectedEmoji2("")
          handleCheckboxChange(false);
  };

  const handleStatusChange = async (slackStatus) => {
    setSlackStatus(slackStatus);
  };

  const handleCheckboxChange = (checked) => {
    setFrontStatusCheck(checked);
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji.shortcodes);
    setSelectedEmoji2(emoji.native);
    setPickerVisible(false);
  };

  const clearClick = async () => {
    if(disabled2){
      return;
    }
        setDisabled2(true); 
       
        const response = await fetch(webHookURL+'/slackStatus', {
          method: 'POST',
          body: JSON.stringify({slack_status: "", emoji: ""}),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          console.error('Failed to post data to webhook.');
        }
        
        const response2 = await fetch(webHookURL+'/frontStatus', {
          method: 'POST',
          body: JSON.stringify({id: frontuserID, front_status: true}),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response2.ok) {
          console.error('Failed to post data to webhook.');
        }
        setSlackStatus("");
        setSelectedEmoji2("")
        handleCheckboxChange(false);
        
};

return (
  <div class="status-container">
  <h1 class="status-header">Current Slack Status:</h1>
  <div class="status-wrapper">
    <h1 class="status-text">
      {currentSlackStatus ? currentSlackStatus : 'No status is set in Slack...'}
    </h1>
    <h1 class="status-emoji">
      {currentEmoji ? emojiDictionary.getUnicode(currentEmoji) : null}
    </h1>
  </div>
  <div class="input-container">
    <div class="input-field">
      <label htmlFor="input" style={{ marginBottom: '10px' }}>
        Enter Slack Status Text:
      </label>
      <Input
        type="text"
        maxWidth="200"
        value={slackStatus}
        onChange={handleStatusChange}
        placeholder="Enter Slack status here"
        style={{ marginBottom: '10px', width: '100%' }}
      />
    </div>
    <div class="checkbox-container">
      <label htmlFor="checkbox" class="checkbox-label">
        Set OOO in Front?
      </label>
      <input
        type="checkbox"
        id="checkbox"
        checked={frontStatusCheck}
        onChange={(event) => handleCheckboxChange(event.target.checked)}
      />
    </div>
    <div class="emoji-container">
      <div style={{ width: '40%', marginRight: '10px' }}>
        <p>Selected Emoji: {nativeEmoji}</p>
      </div>
      <div style={{ width: '60%' }}>
        <Button size="large" onClick={() => setPickerVisible(!isPickerVisible)} style={{ width: '100%' }}>
          Select Emoji
        </Button>
        {isPickerVisible && (
          <div class="emoji-picker-container">
            <div class="emoji-picker-menu">
              <Picker
                data={data}
                set="native"
                previewPosition="none"
                onEmojiSelect={handleEmojiSelect}
              />
            </div>
          </div>
        )}
      </div>
    </div>
    <div class="button-container">
      <Button size="large" onClick={handleClick} disabled={disabled1}>
        {disabled1 ? 'Updating Status...' : 'Change Status'}
      </Button>
      <Button size="large" onClick={clearClick} disabled={disabled2}>
        {disabled2 ? 'Clearing Status...' : 'Clear Status'}
      </Button>
    </div>
  </div>
</div>
);
}
export default Tutorial;
