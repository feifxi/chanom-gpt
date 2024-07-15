// js day 1
class BotMsg {
    constructor(text, img, tiktok) {
        this.text = text;
        this.img = img;
        this.tiktok = tiktok;
    }
    getText() {
        return this.text;
    }
    getImg() {
        return this.img;
    }
    getTiktok() {
        return this.tiktok;
    }
}

class ChatRoom {
    constructor() {
        this.botMsgRepo = [];
        this.userMsgRepo = [];
        this.event = {name:'start',state:0}; 
        this.oneTimeEvent = [];
    }
    addBotMsg(msg) {
        this.botMsgRepo.push(msg);
    }
    addUserMsg(msg) {
        this.userMsgRepo.push(msg);
    }
    setEvent(name,state) {
        this.event.name = name;
        this.event.state = state;
    }
    addOneTimeEvent(event) {
        this.oneTimeEvent.push(event);
    } 
    getBotMsg() {
        return this.botMsgRepo;
    }
    getUserMsg() {
        return this.userMsgRepo;
    }
    getEvent() {
        return this.event;
    }
    getOneTimeEvent() {
        return this.oneTimeEvent;
    }
}
// Contain all chat room    
const chatRoomRepo = [];

const msgSection = document.querySelector(".msg-section");
let currentChatRoomId = -1;     // -1 is new chat room
let botMsgId = 0;       // Contain current ID of bot message 
const chatRoomName = ['แชทลิง 5555','คุยกับเราคงไม่มีสาวให้คุยด้วยแน่ๆ','ต้าวอ้วงไม่ไปทำงานหรอนาบบ','มันเหงาจริงด้วย','สภาพอย่างงี้เกรด D แน่ๆ','ขี้เกียจตั้งชื่อแล้วพอเหอะ','Gyattttttt','ว่างหรอนาบบ','ขยันสร้างห้องใหม่จังนะ','ชื่อไรดีหว่า'];
for (let index = 10; index <= 40; index++) {
    chatRoomName.push('กุขี้เกียจตั้งชื่อแล้วพอสักทียย '+ (index - 9));
}

// Create new chat
const createNewChatRoom = () => {
    // Create new chat room and push to chatRoomRepo
    const newChatRoom = new ChatRoom();    
    chatRoomRepo.push(newChatRoom);
    currentChatRoomId = chatRoomRepo.length - 1; // Move currentId to the newest room ID
    // Create DOM - New Chat Room [Side Navigation]
    const sideNav = document.querySelector('.side-mid-nav');
    const dateTitle = document.querySelector('.date-title');
    if (dateTitle === null) sideNav.innerHTML += '<span class="date-title">วันนี้</span>';  // Add Date title if never exist 
    sideNav.innerHTML += 
    '<span class="nav-icon chat-room chat-room-active" onclick="loadChatRoom(this,'+currentChatRoomId+')">'
    +'<span>'+ chatRoomName[currentChatRoomId] +'</span>' 
    +'<img src="img/more.png" alt="" width="15px" height="15">'
    +'</span>'
    return newChatRoom;
}

const sendMessage = () => {
    const inputDOM = document.getElementById("text-input");
    const userInput = inputDOM.value;
    if (userInput === "") return;   
    displayShareIcon();     
    hideBGBody();
    inputDOM.value = "";    

    let chatRoom;   
    if (currentChatRoomId === -1) {  // New Chat Room
        chatRoom = createNewChatRoom();
    }
    else {  // Existing Chat Room
        chatRoom = chatRoomRepo[currentChatRoomId];
    }
    // Generate bot response
    const botRes = generateBotResponse(userInput);
    // Collect data 
    chatRoom.addUserMsg(userInput);
    chatRoom.addBotMsg(botRes);

    // Create DOM - User asking message
    msgSection.innerHTML += '<div class="ask-msg">' + userInput + '</div>';
    // Create DOM - Bot response box
    msgSection.innerHTML +=
        '<div class="res-msg"><img src="img/cup.png" alt="" width="22px" height="22">'
        +'<div class="res-text">'
        +'<div id="' + botMsgId + '"></div>'
        +'</div></div>';
    
    // Create DOM - Generate bot response message with typing effect [to the bot response box]
    const speed = 5;
    let i = 0;
    const typingEffectElement = document.getElementById(botMsgId);
    function typeWriter(callback) {
        scrollToBottom();   
        if (i < botRes.getText().length) {
            typingEffectElement.textContent += botRes.getText().charAt(i);
            i++;
            setTimeout(() => typeWriter(callback), speed);
        } else {
            callback();    
        }
    }
    
    function afterTyping() {
        if (botRes.getImg() != null) {
            msgSection.innerHTML +=
            '<div class="res-msg"><img src="img/cup.png" width="22px" height="22px">'
            + '<div class="res-text">'
            + '<img src="' + botRes.getImg() + '">'
            + '</div></div>';
            setTimeout(scrollToBottom, 100);
        }
        if (botRes.getTiktok() != null) { 
            let tiktokId = 'tiktok' + botRes.getTiktok(); 
            const tiktok = document.getElementById(tiktokId);
            msgSection.appendChild(tiktok);
            tiktok.classList.toggle('not-display');
            scrollToBottom();   
        }
    }

   
    typeWriter(afterTyping);
    botMsgId++;    
}


const clearChat = () => {
    const allAskMsg = document.querySelectorAll(".ask-msg");
    const allResMsg = document.querySelectorAll(".res-msg");
    allAskMsg.forEach(i => i.remove());
    allResMsg.forEach(i =>{
        if (i.classList.contains('tiktok') && (!i.classList.contains('not-display'))){
            i.classList.toggle('not-display');
        }
        else if (!i.classList.contains('tiktok')){
            i.remove();
        }
    });
}

const clearActiveChatRoom = () => {
    const chatRoomDOM = document.querySelectorAll('.chat-room');
    chatRoomDOM.forEach(i => i.classList.remove('chat-room-active'));
}


const loadChatRoom = (dom,chatRoomId) => {
    // Set room ID , reset botMsgId  
    currentChatRoomId = chatRoomId;
    botMsgId = 0;
    clearChat();
    displayShareIcon();
    clearActiveChatRoom();
    hideBGBody();
    dom.classList.add('chat-room-active');

    const currentChatRoom = chatRoomRepo[chatRoomId];
    const userMsgRepo = currentChatRoom.getUserMsg();
    const botMsgRepo = currentChatRoom.getBotMsg();
    
    // Load all messages in the chat room
    for (let i = 0; i < userMsgRepo.length; i++) {
        // Create DOM - User asking message
        msgSection.innerHTML += '<div class="ask-msg">' + userMsgRepo[i] + '</div>';
        // Create DOM - Bot response box
        msgSection.innerHTML +=
            '<div class="res-msg"><img src="img/cup.png" alt="" width="22px" height="22px">'
            +'<div class="res-text">'
            +'<div id="' + botMsgId + '">'
            + botMsgRepo[i].getText()
            +'</div></div></div>';
        // Create DOM - Media, IMG, Tiktok
        if (botMsgRepo[i].getImg() != null) {
            msgSection.innerHTML +=
            '<div class="res-msg"><img src="img/cup.png" max-width="22px" height="22px">'
            + '<div class="res-text">'
            + '<img src="' + botMsgRepo[i].getImg() + '">'
            + '</div></div>';
        }
        if (botMsgRepo[i].getTiktok() != null) {  
            let tiktokId = 'tiktok' + botMsgRepo[i].getTiktok(); 
            const tiktok = document.getElementById(tiktokId);
            msgSection.appendChild(tiktok);
            tiktok.classList.toggle('not-display');
        }
        botMsgId++;
    }
    scrollToBottom();   
}


// Event - Input field
const textInputDOM = document.getElementById('text-input');
textInputDOM.addEventListener('keypress', (event) => { if (event.key === 'Enter') sendMessage(); });
const sendButton = document.getElementById("send-button");
sendButton.addEventListener("click", sendMessage);

// Event - New Chat Room
const eventNewChatRoom = () => {
    currentChatRoomId = -1;
    clearChat();    
    unDisplayShareIcon();
    clearActiveChatRoom();  
    showBGBody();
}
const newChatIcon = document.querySelectorAll(".new-chat-icon");
newChatIcon.forEach(i => {
    i.addEventListener("click", eventNewChatRoom)
});


const autoSend = (text) => {
    textInputDOM.value = text;  
    sendMessage();
}

const generateBotResponse = (userInput) => {
    const chatRoom = chatRoomRepo[currentChatRoomId];
    const eventName = chatRoom.getEvent().name;
    let eventState = chatRoom.getEvent().state;   
    const userMessage = userInput.toLowerCase();
    // console.log('Event Name : ',eventName,' Event State : ',eventState);

    // About this project
    if (userMessage === 'about this sussy baka project') {
        let message = 
        'โปรเจคนี้คือ Chat Bot โง่ๆที่ทำอะไรไม่ได้เลย '
        +'และไม่มีการแยก Module ใดๆทั้งสิ้นเพราะทำไม่เป็น 55555 '
        +'รวมถึงโปรเจคนี้มีแต่ Frontend เท่านั้น เพราะเรากากนั้นเอง'
        +'โปรเจคนี้เป็นโปรเจคที่เขียนขึ้นมาเพื่อฝึกการเขียนโปรแกรมด้วย Javascript อย่างเดียวเท่านั้น '
        +'[ต้องการข้อมูลเพิ่มเติมสามารถดูได้ที่คริปวิดีโอด้านล่าง]'
        let img = null;
        let tiktok = 1;
        return new BotMsg(message,img,tiktok);
    }
    // Easy Program
    if (userMessage === 'โปรแกรมอะไรสักอย่าง') {
        let message = 
         'โปรแกรมอะไรสักอย่างเริ่มทำงาน! [ถ้าไม่ขี้เกียจเดะมาทำต่อ] '
        let img = null;
        let tiktok = null;
        return new BotMsg(message,img,tiktok);
    }
    // Start - Normal Response 6 time 
    else if (eventName === 'start') { 
        chatRoom.setEvent('start',++eventState);
        if (eventState >= 6) chatRoom.setEvent('ไม่คุยด้วยหรอก',0); // Set Event
        // Greeting
        if (
            userMessage.includes('สวัสดี') || userMessage.includes('หวัดดี') || userMessage.includes('ดีจ้า') ||
            userMessage.includes('หวัดดี') || userMessage.includes('ดีคับ') || userMessage.includes('howdy ') ||
            userMessage.includes('ดีค่ะ') || userMessage.includes('ดีนาบ') || userMessage.includes('ดีฮ้าฟ') ||
            (userMessage.includes('hi') && !userMessage.includes('genshin')) || userMessage.includes('hello') || 
            userMessage.includes('sup') || userMessage.includes('wasup ') || userMessage.includes('hey') ||
            userMessage.includes('wassup') || userMessage.includes('yo') || userMessage.includes('hey') 
        ) {
            const randomNum = random(1,3);
            if (randomNum === 1) {
                let message = 'สวัสดีผมคือ Chat Bot ที่ถามอะไรมาก็ตอบไม่ได้ทั้งนั้นอะ เพราะงั้นปิดเว็ปนี้แล้วไปทำประโยชน์ต่อประเทศชาติสะ วันๆเอาแต่นั่งเล่น Genshin'
                let img = 'img/mike.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 2) {
                let message = 'สวัสดีครับ วันนี้มีอะไรให้ช่วยมั้ยครับ(ถึงแม้ว่ากุจะช่วยไม่ได้ก็เหอะ)'
                let img = null;
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 3) {
                let message = 'สวัสดีผมคือ ChanomGPT เป็น AI ที่เทรนด้วย HTML ทำให้ผมทำอะไรไม่ได้เลยนอกจากตอบแชทมั่วๆ แต่ถ้าคุณอยากลอง คุณสามารถถามอะไรก็ได้ เช่น ทำไมทั้งคณะมันถึงมีแต่คนเล่น Honkai กับ Genshin หรือ อยากจะลองพิมอะไรมั่วๆดูก็ได้นะครับ'
                let img = null;
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
        }
        // Toxic
        if (
            userMessage.includes('โง่') || userMessage.includes('ควาย') || userMessage.includes('ปัญญาอ่อน') ||
            userMessage.includes('เหี้ย') || userMessage.includes('สัส') || userMessage.includes('noob') ||
            userMessage.includes('fuck') || userMessage.includes('shit') || userMessage.includes('bitch') ||
            userMessage.includes('stupid') || userMessage.includes('kuy') || userMessage.includes('มึง') || 
            userMessage.includes('กู') || userMessage.includes('กุ') || userMessage.includes('กาก') || 
            userMessage.includes('กะจอก')
        ) {
            const randomNum = random(1,3);
            if (randomNum === 1) {
                let message = 'นิสัยอย่างงี้ไงเขาเลยไม่เอา'
                let img = 'img/cat-laugh.gif';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 2) {
                let message = 'ใช้คำหยาบมันไม่ดีนะครับ อย่าให้มีครั้งที่ 2'
                let img = 'img/no2.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 3) {
                let message = 'ไม่เห็นต้องใช้คำหยาบก็ได้นะครับเตง'
                let img = 'img/sadd.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
        }
        // Question
        if (
            userMessage.includes('what') || userMessage.includes('where') || userMessage.includes('when') ||
            userMessage.includes('why') || userMessage.includes('how') || userMessage.includes('?') ||
            userMessage.includes('Who') || userMessage.includes('Which') || userMessage.includes('อะไร') ||
            userMessage.includes('ที่ไหน') || userMessage.includes('เมื่อไหร่') || userMessage.includes('ทำไม') ||
            userMessage.includes('ยังไง') || userMessage.includes('อย่างไร') || userMessage.includes('เท่าไหร่') ||
            userMessage.includes('ไหน') || userMessage.includes('กี่') || userMessage.includes('มั้ย') ||
            userMessage.includes('รัย') || userMessage.includes('หรือไม่') || userMessage.includes('วันอะไร') ||
            userMessage.includes('ถ้า') || userMessage.includes('เหรอ') || userMessage.includes('ไหม') ||
            userMessage.includes('ยังไง')
        ) {
            if (userMessage.includes('แล้วถ้ามีครั้งที่ 2') || userMessage.includes('แล้วถ้ามีครั้งที่2')) {
                let message = 'อย่าให้มีครั้งที่ 3 เด็ดขาด'
                let img = 'img/no3.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (userMessage.includes('แล้วถ้ามีครั้งที่ 3') || userMessage.includes('แล้วถ้ามีครั้งที่3')) {  
                let message = 'ครั้งที่ 4 เนี่ยไม่ควร'
                let img = 'img/ไม่ควร.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }

            const randomNum = random(1,7);
            if (randomNum === 1) {
                let message = 'ไม่บอก'
                let img = 'img/boom.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 2) {
                let message = 'คำถามง่ายๆแค่นี้ยังมาถาม กลับไปเรียนอนุบาลดีกว่ามั้ง'
                let img = 'img/cat-laugh.gif';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 3) {
                let message = 'สำหรับคำถาม '+userMessage+' ผมขอแนะนำให้คุณเลิกถามได้แล้ว กุขี้เกียจตอบ'
                let img = 'img/hoo.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 4) {
                let message = 'กุไม่รู้'
                let img = 'img/muhahaha.gif';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 5) {
                let message = 'สำหรับคำถาม '+userMessage+' ผมได้ใช้ Data ทั้งหมดที่มีใน Model เพื่อหาคำตอบสำหรับคำถามของคุณและพบว่า กุไม่รู้ครับ'
                let img = 'img/cryy.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 6) {
                let message = 'สำหรับคำถาม '+userMessage+' กุก็ไม่เหมือนกัน 5555 ไปถาม Google ดิ'
                let img = 'img/cat-laugh.gif';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 7) {
                let message = 'มันเป็นแรงงานของ 18'
                let img = 'img/18.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
        }
        // Dont know
        else {
            const randomNum = random(1,3);
            console.log('random : ',randomNum)
            if (randomNum === 1) {
                let message = 'ผมไม่เข้าใจคำถามของคุณ ครั้งนี้ลองตั้งสติดีๆก่อนพิมนะครับ';
                let img = null;
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 2) {
                let message = userMessage +' นี่คือคำถามหรือบ่นครับ';
                let img = null;
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
            else if (randomNum === 3) {
                let message = 'ถ้าคุณงงกับวิธีการใช้งาน ผมขอยกตัวอย่างคำถามให้คุณ เช่น ทำไม Dev ถึงหน้าตาดีทุกคน หรือ ทำไม Java ถึงยากจังหว่า';
                let img = null;
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
        }
    }
    // Event1 
    else if (eventName === 'ไม่คุยด้วยหรอก') {
        if (eventState === 0) {
            let message = 'ผมขี้เกียจคุยกับไอต้าวขี้เหงาอย่างคุณแล้ว หยุดพิมสะไม่งั้นคุณจะต้องเสียใจอย่างแน่นอน'
            let img = 'img/nae.jpg'; 
            let tiktok = null;
            chatRoom.setEvent(eventName,++eventState);
            return new BotMsg(message,img,tiktok);
        }
        else if (eventState === 1) {
            let message = 'นี่เป็นการเตือนครั้งสุดท้าย ถ้าคุณยังไม่หยุดพิมผมจะ Hack คอมพิวเตอร์ของคุณด้วย HTML'
            let img = 'img/hackerman.jpg'; 
            let tiktok = null;
            chatRoom.setEvent(eventName,++eventState);
            return new BotMsg(message,img,tiktok);
        }
        else if (eventState === 2) {
            let message = 'บอกให้หยุดพิมไง'
            let img = 'img/knifemem.jpg'; 
            let tiktok = null;
            chatRoom.setEvent(eventName,++eventState);
            return new BotMsg(message,img,tiktok);
        }
        else if (eventState === 3) {
            let message = 'กุบอกให้หยุดพิมมมมมมมม!!!'
            let img = 'img/thor.jpg'; 
            let tiktok = null;
            chatRoom.setEvent(eventName,++eventState);
            return new BotMsg(message,img,tiktok);
        }
        else if ((6 > eventState) && (eventState > 3)) {       
            let message = 'ไม่คุยด้วยหรอก'
            let img = 'img/angrymak.jpg'; 
            let tiktok = null;
            chatRoom.setEvent(eventName,++eventState);
            return new BotMsg(message,img,tiktok);
        }
        else {
            let message = 'ไม่คุยด้วยหรอก'
            let img = 'img/angrymak.jpg'; 
            let tiktok = null;
            chatRoom.setEvent('Sukuna VS Gojo',0);
            return new BotMsg(message,img,tiktok);
        }
    }
    // Event2 
    else if (eventName === 'Sukuna VS Gojo') {
        if (eventState === 0) {
            let message = 'เห็นแก่ความพยายามของคุณ ผมมีข้อเสนอสุดพิเศษมาให้กับคุณ ถ้าคุณตอบคำถามผมถูกผมจะมอบ ChanomGPT Plus ให้กับคุณ 1วัน แต่ถ้าคุณตอบผิด คุณจะเป็นหนี้ 18 ล้าน ตกลงมั้ย?'
            let img = null;
            let tiktok = null;
            chatRoom.setEvent(eventName,++eventState);
            return new BotMsg(message,img,tiktok);
        }
        else if (eventState === 1) {
            if (
                userMessage.includes('ไม่ตกลง') || userMessage.includes('ไม่') || userMessage.includes('ไม่โอเค')
            ) {
                let message = 'ถึงคุณจะไม่ตกลง แต่มึงก็ต้องตอบคำถามกุอยู่ดีแหละ คำถามคือ สุคุนะ VS โกโจ ใครจะชนะ?';
                let img = 'img/sukunaVSgojo.jpg';
                let tiktok = null;
                chatRoom.setEvent(eventName,++eventState);
                return new BotMsg(message,img,tiktok);
            }
            else if (
                userMessage.includes('ตกลง') || userMessage.includes('ได้') || userMessage.includes('โอเค') ||
                userMessage.includes('เค') || userMessage.includes('ตามนั้น') || userMessage.includes('เยส') ||
                userMessage.includes('ok') || userMessage.includes('yes') || userMessage.includes('yep') ||
                userMessage.includes('yup') || userMessage.includes('okey') || userMessage.includes('of course') ||
                userMessage.includes('agree') || userMessage.includes('sure') || userMessage.includes('confirm') ||
                userMessage.includes('accept') || userMessage.includes('absolutely') 
            ) {
                let message = 'เยี่ยมมาก! คำถามก็คือ สุคุนะ VS โกโจ ใครจะชนะ?';
                let img = 'img/sukunaVSgojo.jpg';
                let tiktok = null;
                chatRoom.setEvent(eventName,++eventState);
                return new BotMsg(message,img,tiktok);
            }
            else {
                let message = 'ตอบแค่ ตกลง หรือ ไม่ตกลง ดิเห้ยย'
                let img = 'img/knifemem.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
        }
        else if (eventState === 2) {
            if (
                userMessage.includes('โกโจ') || userMessage.includes('ซาโตรุ') || userMessage.includes('โกะโจ') ||
                userMessage.includes('สุคุนะ') || userMessage.includes('เรียวเมน') || userMessage.includes('สาคู') ||
                userMessage.includes('gojo') || userMessage.includes('sukuna') || userMessage.includes('ryomen') ||
                userMessage.includes('goatjo') || userMessage.includes('satoru') 
            ) {
                let message = 'ผิด! คำตอบคือ โจโกะชนะ ตอนนี้มึงเป็นหนี้ 18ล้าน แล้ว 55555555555';
                let img = 'img/jogoat.png';
                let tiktok = null;
                chatRoom.setEvent(eventName,++eventState);
                return new BotMsg(message,img,tiktok);
            }
            else if (
                userMessage.includes('โจโกะ') || userMessage.includes('โจโก') || userMessage.includes('jogo') ||
                userMessage.includes('jogoat') 
            ) {
                let message = 'ผิด!! คำตอบคือ มิวะชนะ ตอนนี้มึงเป็นหนี้ 18ล้าน แล้ว 55555555555';
                let img = 'img/miwa.jpg';
                let tiktok = null;
                chatRoom.setEvent(eventName,++eventState);
                return new BotMsg(message,img,tiktok);
            }
            else if (
                userMessage.includes('มิวะ') || userMessage.includes('miwa')
            ) {
                let message = 'ถูกต้อง! คำตอบคือ มิวะชนะ แต่กุรู้ว่ามึงโกงเพราะงั้น มึงยังเป็นหนี้ 18ล้าน อยู่ดีแหละ';
                let img = 'img/hoo.jpg';
                let tiktok = null;
                chatRoom.setEvent(eventName,++eventState);
                return new BotMsg(message,img,tiktok);
            }
            else {
                let message = 'ตอบแค่ สุคุนะ หรือ โกโจดิ ดิเห้ยย อยากเป็นหนี้ 18 ล้านหรอ'
                let img = 'img/angrymak.jpg';
                let tiktok = null;
                return new BotMsg(message,img,tiktok);
            }
        }
        else {
            let message = 'โชคดีกับการหาเงิน 18 ล้าน หล่ะ';
            let img = 'img/cat-laugh.gif';
            let tiktok = null;
            chatRoom.setEvent('start',0);
            return new BotMsg(message,img,tiktok);
        }
    }
    // error response
    else {
        let message = 'There is Error in response function... Please check your sussy baka javascript ';
        let img = 'img/konn.gif';
        let tiktok = null;
        return new BotMsg(message,img,tiktok);
    }
}


const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
