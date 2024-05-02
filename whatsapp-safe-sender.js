// ==UserScript==
// @name         Whatsapp safe sender
// @namespace    http://tampermonkey.net/
// @version      2024-03-16
// @description  Making your messages safe
// @author       https://github.com/gabrielpereirapinheiro
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        none
// @require      https://raw.githubusercontent.com/bitwiseshiftleft/sjcl/master/sjcl.js
// ==/UserScript==

(function () {
  "use strict";
  let MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;

  const BUTTON_ID = "whatsapp-safe-sender";
  const MY_KEY = "@SETyourSAF3keyHER3";

  const decryptNote=(text) =>{
    try {
        const decodedData = atob(text);
      let decryptText = sjcl.json.decrypt(MY_KEY, decodedData);
      return decryptText+" 🔒";
    } catch (e) {
      console.log(e);
      return text;
    }
  }

  const encryptNote=(text) =>{
    try {
      let test = sjcl.json.encrypt(MY_KEY, text);
const encodedData = btoa(test); // encode a string


      return encodedData;
    } catch (e) {
      return text;
    }
  }

  var observer = new MutationObserver(function (mutations, observer) {

    //Adding button to send safe message
    if (!document.getElementById(BUTTON_ID)) {

      //Portugues button
      let buttonSendElement = document.querySelector('[aria-label="Enviar"]');

      //English button
      if (!buttonSendElement) {
        buttonSendElement = document.querySelector('[aria-label="Send"]');
      }

      //Creating button
      let senderSafeButton = document.createElement("button");
      senderSafeButton.innerHTML = "Safe sender";
      senderSafeButton.setAttribute("id", BUTTON_ID);
      senderSafeButton.setAttribute('style', 'background-color:white;border-radius: 5px; padding:3px');


      //Adding button
      let parentDiv = buttonSendElement.parentNode;
      parentDiv.appendChild(senderSafeButton);

      let senderSafeButtonAction = document.querySelector(
        "[id=" + BUTTON_ID + "]"
      );

      //Adding action to button
      senderSafeButtonAction.addEventListener("click", () => {
        let textAreaMsg = document.getElementsByClassName(
          "selectable-text copyable-text"
        );
        //This is the texarea (span)
        textAreaMsg = textAreaMsg[textAreaMsg.length - 2];
        let messageByUser = textAreaMsg.textContent;

        let encryptedMessage = encryptNote(messageByUser);

        document.execCommand("selectAll");

        setTimeout(() => {
          document.execCommand("cut");
        }, 10);

        document.execCommand("insertText", true, encryptedMessage);

        setTimeout(() => {
          //Send message
          (
            main.querySelector("[data-testid='send']") ||
            main.querySelector("[data-testid='enviar']") ||
            main.querySelector("[data-icon='send']") ||
            main.querySelector("[data-icon='enviar']")
          ).click();

          setTimeout(() => {
            //Translate chat
            // Get from screen
            let messagesList = document.getElementsByClassName(
              "selectable-text copyable-text"
            );
            let size = messagesList.length || 0;
            for (let i = 0; i < size - 1; i++) {
              let element = messagesList[i];
              element.textContent = decryptNote(element.innerText);
            }
          }, 1000);
        }, 100);
      });
    }
  });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  observer.observe(document, {
    subtree: true,
    attributes: true,
    //...
  });

})();
