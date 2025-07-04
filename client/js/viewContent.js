import { initializeQuillEditor } from "./createEditor.js";
import host from './host.js'

const productName = localStorage.getItem("productName");
let div = document.getElementById(productName + "Content");
const addImage = document.getElementById(productName + "addImage");
const imageURL = document.getElementById(productName + "imageURL");

// const apiURL = "http://localhost:5001/product/view";
const apiURL = `${host}/product/view`;
const data = {
  name: productName,
};
console.log(productName);
// add loading screen
const loadingScreen = document.getElementById("preload");
loadingScreen.style.display = "flex";
document.body.style.overflowY = "hidden";

// get the product content from the DB and display it
fetch(apiURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify(data),
})
  .then((res) => res.json())
  .then((response) => {
    if (!response.message) {
      // turn off loading screen
      loadingScreen.style.display = "none";
      document.body.style.overflowY = "auto";

      console.log("response:ff  ", response);
      alert("internal sever error please call the admin");
      throw new Error("Something went wrong please call the admin");
    } else {
      console.log("response:ff  ", response);
      // Save content to local storage using the provided key
      localStorage.setItem("productContent", response.content);
      div.innerHTML = response.content;
      // here we should update the value that will apper in the editor
      
      localStorage.setItem("productImages", response.images);
      console.log("response.images: ", response.images);
      displayImages(response.images);
      // alert("content saved");
    }
    // the response used .send in backend
  });
function displayImages(images) {
  console.log("images: ", images);
  // Get the container element where you want to display the images
  const container = document.getElementById(productName + "imageContainer");
  // empty it first
  container.innerHTML = "";
  // Loop through the array of image URLs and create <img> elements
  images.forEach((imageUrl) => {
    //create li to wrap the img in it
    const li = document.createElement("li");
    const imgElement = document.createElement("img");
    //create delete button
    const delImgBtn = document.createElement("button");
    delImgBtn.innerHTML = "delete";
    delImgBtn.className = "deleteImgBtn";
    // Set the src attribute to the image URL
    imgElement.src = imageUrl;

    // Optionally, set other attributes or styles for the <img> element
    // imgElement.alt = 'Product Image';
    // imgElement.classList.add('product-image');
    //append delete button to the li
    li.appendChild(delImgBtn);
    //append img to li
    li.appendChild(imgElement);
    // Append the li element to the ul
    container.appendChild(li);
    //remove the img on clicking the delete button
    delImgBtn.addEventListener("click", async () => {
      container.removeChild(li);
      const url = li.querySelector("img").src;
      const apiURL = `${host}/product/deleteImage`;
 
      // const apiURL ="https://elrewiee-company-backend.egyequipments.cc/product/deleteImage";

      await fetch(apiURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productName, image: url }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (!response.message) {
            console.log("response: ", response);
            throw new Error("Network response was not ok");
          } else {
            //khateeb el image fel local storage w display it
            localStorage.setItem("productContent", response.content);
            div.innerHTML = response.content;
            localStorage.setItem("productImages", response.images);
            console.log("response.images: ", response.images);
            displayImages(response.images);
          }
          // the response used .send in backend
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
  const deleteBtn = document.querySelectorAll(".deleteImgBtn");

  if (
    JSON.parse(localStorage.getItem("isAdmin")) === false ||
    JSON.parse(localStorage.getItem("isAdmin")) === null
  ) {
    // Hide delete buttons for admin
    deleteBtn.forEach((btn) => {
      btn.style.display = "none";
    });
  }
}

// add image into the DB , local storage and display it

var product1Editor = initializeQuillEditor(
  productName + "Editor",
  "productContent",
  true
);
const editArea = document.getElementById("editor");
const editBtn = document.getElementById("editBtn" + productName);
const saveBtn = document.getElementById("saveButton" + productName);
saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  editArea.classList.toggle("active");
  document.body.classList.toggle("active");
  e.target.classList.toggle("active");
  product1Editor.saveContent();
  product1Editor.closeEditorAndWindow();

  //  const newQuill = initializeQuillEditor(
  //   productName + "Editor",
  //   "productContent",
  //   true
  // );
  // console.log(newQuill);
  // newQuill.closeEditorAndWindow();
});

// Save button specific to Product 1
// document.getElementById(buttonID).addEventListener("click",  function () {
//    product1Editor.saveContent();
// });
addImage.addEventListener("click", function () {
  console.log("add image");
  var productName = localStorage.getItem("productName");
  // const apiURL = "http://localhost:5001/product/edit";
  const apiURL = `${host}/product/edit`;
  console.log("imageURL.value: ", imageURL.value);
  const newImages = imageURL.value;
  const data = {
    productName,
    newImages,
  };
  // add image into the DB
  fetch(apiURL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      if (!response.message) {
        console.log("response:  ", response);
        alert("internal sever error please call the admin");
        throw new Error("Network response was not ok");
      } else {
        //khateeb el image fel local storage w display it
        localStorage.setItem("productContent", response.content);
        div.innerHTML = response.content;
        // get quil editor and update it
        //ql-editor this is the id 
        const Quill = document.querySelector(".ql-editor");
        Quill.innerHTML = "sdfdsf";
        console.log("Quill: ", Quill);
        localStorage.setItem("productImages", response.images);
        console.log("response.images: ", response.images);
        displayImages(response.images);
      }
      // the response used .send in backend
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
