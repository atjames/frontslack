import React, {useEffect, useState, useRef} from 'react';
import { useFrontContext } from '../providers/frontContext';

function Tutorial() {

  const context = useFrontContext();
  const [color1, setColor1] = useState('green');
  const [color2, setColor2] = useState('green');
  const [disabled1, setDisabled1] = useState(false);
  const [disabled2, setDisabled2] = useState(false);
  const [slackStatus,setSlackStatus] = useState('');
  const [emojiText,setEmojiText] = useState('');
  const [frontStatusCheck, setFrontStatusCheck] = useState(false);
  const frontuserID = context.teammate.id;
  const webHookURL = "https://868e-68-36-121-182.ngrok.io" 
  const inputRef = useRef(null);
  //test

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setDisabled1(false);
      setColor1('green');
    }, 4000);
    const timeout2 = setTimeout(() => {
      setDisabled2(false);
      setColor2('green');
    }, 4000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    }
  }, [disabled1, disabled2]);

  const handleClick = async () => {
      if(disabled1){
        return;
      }
        //const slackPayload = {slack_status:{slackStatusText}};
        setColor1(disabled1 ? 'green' : 'red');
        setDisabled1(true); 
        
          const response = await fetch(webHookURL+'/slackStatus', {
            method: 'POST',
            body: JSON.stringify({slack_status: slackStatus, emoji: emojiText}), //fix this!!!
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
          
  };

  const handleStatusChange = event => {
    setSlackStatus(event.target.value);
  };

  const handleStatusChange2 = event => {
    setEmojiText(event.target.value);
  };

  const handleCheckboxChange = event => {
    setFrontStatusCheck(event.target.checked);
  };


  const clearClick = async () => {
    if(disabled2){
      return;
    }
      //const slackPayload = {slack_status:{slackStatusText}};
        setColor2(disabled2 ? 'green' : 'red');
        setDisabled2(true); 
        inputRef.current.value = '';
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
          body: JSON.stringify({id: frontuserID, front_status: !frontStatusCheck}),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response2.ok) {
          console.error('Failed to post data to webhook.');
        }

};
return (
  <div className="button-container">
    <div className="textinput">
      <label htmlFor="input">Enter Slack Status Text:</label>
      <input
        type="text"
        value={slackStatus}
        onChange={handleStatusChange}
        placeholder="Enter Slack status here"
        ref={inputRef}
      />
      
      <div className="textinput">
      <label htmlFor="input">Enter Slack emoji Text:</label>
      <input
        type="text"
        value={emojiText}
        onChange={handleStatusChange2}
        placeholder="Enter Emoji text here"
        ref={inputRef}
      />

      <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="checkbox" style={{ marginRight: '10px' }}>
      Set OOO in Front? 
      </label>
      <input
        type="checkbox"
        id="checkbox"
        checked={frontStatusCheck}
        onChange={handleCheckboxChange}
      />
      </div>
  
      <button
        style={{ backgroundColor: color1 }}
        onClick={handleClick}
        disabled={disabled1}
      >
        {disabled1 ? 'Updating Status...' : 'Send Status'}
      </button>
      <br />
      <button
        style={{ backgroundColor: color2 }}
        onClick={clearClick}
        disabled={disabled2}
      >
        {disabled2 ? 'Clearing Status...' : 'Clear Status'}
      </button>

    </div>
  </div>
  </div>
  
);
}
export default Tutorial;
