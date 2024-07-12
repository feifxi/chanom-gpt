
let sideNavigation = () => {
    const sideNav = document.querySelector(".side-navigation");
    const versionIcon = document.querySelector(".version-icon");
    const chatSecDOM = document.querySelector(".chat-section");
    const msgSecDOM = document.querySelector(".msg-section");

    // body 
    const body = document.querySelector("body");
    const style = getComputedStyle(sideNav);    
    if (style.width === "0px") {
          
        // Display
        sideNav.style.width = "260px";
        // Style Element
        if (window.matchMedia("(max-width: 800px)").matches) return; 
        versionIcon.style.marginLeft = "175px";
        chatSecDOM.style.marginLeft = "9%";
        msgSecDOM.style.marginLeft = "35%";
        body.style.backgroundPositionX = "60%";
        
    }
    else {
        // Hide
        sideNav.style.width = "0";
        // Style Element
        if (window.matchMedia("(max-width: 800px)").matches) return;
        versionIcon.style.marginLeft = "0";
        chatSecDOM.style.marginLeft = "0";
        msgSecDOM.style.marginLeft = "26%";
        body.style.backgroundPositionX = "50%"  
    }
}


let dropDown = (dropdown) => {
    const style = getComputedStyle(dropdown);
    if (style.display === "none") {
        dropdown.style.display = "flex";
    }
    else {
        dropdown.style.display = "none";
    }
} 

let displayShareIcon = () => {
    const shareIcon = document.querySelector(".share-icon");
    shareIcon.classList.remove("not-display");
} 
let unDisplayShareIcon = () => {
    const shareIcon = document.querySelector(".share-icon");
    shareIcon.classList.add("not-display");
} 

// Add Event - Side Navigation
const sideNavIcon = document.querySelectorAll(".side-nav-icon");
sideNavIcon.forEach(i => {i.addEventListener("click", sideNavigation)})

// Add Event - Version Dropdown
const versionIcon = document.querySelector(".version-icon");
versionIcon.addEventListener("click",()=>{
    versionIcon.classList.toggle("version-toggle");
    const versionDropDOM = document.querySelector(".version-dropdown");
    dropDown(versionDropDOM);
});
 
// Add Event - Profile Dropdown
const profileIcon = document.querySelector(".profile-icon");
profileIcon.addEventListener("click",()=>{
    const profileDropDOM = document.querySelector(".profile-dropdown");
    dropDown(profileDropDOM);
});

// Display / Un Display  ChanomGPT Background IMG 
const showBGBody = () => {
    const body = document.querySelector('body');
    body.style.backgroundImage = 'url(img/bg-logo-gpt.png)';
} 
const hideBGBody = () => {
    const body = document.querySelector('body');
    body.style.backgroundImage = 'none';
} 

const scrollToBottom = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}


// Display / Un Display  Pop Up
const displayPopUp = (title,content) => {
    const popUpDOM = document.querySelector('.pop-up');
    const titleDOM = document.getElementById('pop-up-title-text');
    const contentDOM = document.querySelector('.pop-up-body');
    popUpDOM.style.display = 'flex';
    titleDOM.innerHTML = title;
    contentDOM.innerHTML = content;
}
const closePopUp = () => {
    const popUp = document.querySelector('.pop-up');
    popUp.style.display = 'none';
}


// Add Event - Share Icon
const shareIcon = document.querySelector(".share-icon");
shareIcon.addEventListener("click",()=>{
    let title = 'แชร์ไม่ได้หรอก เพราะกุทำไม่เป็น'
    let content = '<img src="img/hehe.jpg">'
    displayPopUp(title,content);
    // Prepare data - เผื่ออนาคตมาทำต่อ
    const chatRoom = chatRoomRepo[currentChatRoomId];
    chatRoom.getBotMsg().forEach(i => {console.log('Share DATA : ',i.getText())})
});

// Add Event - Attach Icon
const attachIcon = document.querySelector(".attach-icon");
attachIcon.addEventListener("click",()=>{
    let title = 'แนบไฟล์ไม่ได้หรอก กุไม่มีเงินซื้อ Server 5555'
    let content = '<img src="img/cryy.jpg">' 
    displayPopUp(title,content);
});


// Add Event - Contact Us
const contactUs = document.getElementById('contact-us');
contactUs.addEventListener("click",()=>{
    let title = 'กุไม่ให้ Contact หรอกเดะตามมาด่ากุ 5555'
    let content = '<img src="img/cat-laugh.gif">'
    displayPopUp(title,content);
});

// Add Event - Setting
const setting = document.getElementById('setting');
setting.addEventListener("click",()=>{
    let title = 'การตั้งค่า'
    let content = ' Skibidi Rizz Aura <input type="range">' 
    displayPopUp(title,content);
});


// Add Event - Upgrade Version
const upgradeVersion = document.querySelectorAll('.upgrade-version');
upgradeVersion.forEach(i => {i.addEventListener('click',()=> {
    let title = 'อัปเกรดบริการของคุณ'
    let content = 
    '<h3>สิทธิประโยชน์หลังการอัปเกรด</h3>'
    +'<ul>'
    +'<li>คุณจะเป็น Sigma Alpha Wolf และสามารถนำไปอวดป้าข้างบ้านได้</li>'
    +'<li>เป็นที่รักของ Indian call center</li>'
    +'<li>เวอร์ชันอัปเกรดทำอะไรไม่ได้เหมือนเดิมอะ แม่ง Scam 5555</li>'
    +'<li>คุณจะเสียใจในภายหลังอย่างแน่นอน</li>'
    +'</ul>'
    +'<h3>เงื่อนไขการอัปเกรด</h3>'
    +'<ul>'
    +'<li>ให้คุณสั่งซื้อชุดภาคสนามได้ที่ลิ้งนี้ ' 
    +'<a href="https://www.lazada.co.th/products/1-3-s-24-m-26-l-28-1-i383076027.html" target="_blank" >ชุดภาคสนาม</a> </li>'
    +'<li>ใส่ชุดภาคสนามมาที่ใต้ตึก Lx ในเวลา 2 ทุ่ม</li>'
    +'<li>จากนั้นให้คุณเต้น '
    +'<a href="https://www.tiktok.com/@dennis_tayag/video/7298967486521773318?q=make%20me%20sweat%20dance&t=1720628841928" target="_blank" >Make Me Sweat</a>'   
    +' จนกว่ารปภ.จะมาไล่</li>'
    +'</ul>'
    displayPopUp(title,content);
})})