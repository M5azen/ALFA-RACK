import host from './host.js'

// editor.js
const productName = localStorage.getItem("productName");
const div = document.getElementById(productName + "Content");
var quill;
export function initializeQuillEditor(productName, storageKey, newWindow) {
  // console.log("1  " +newWindow);
  console.log(newWindow + "created\\n\n\n\n\n");
  // Initialize Quill editor
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
    ["link", "image", "video"],
    ["formula"],
  ];

   quill = new Quill(`#${productName}`, {
    modules: {
      toolbar: toolbarOptions,
    },
    theme: "snow",
  });
  function closeEditorAndWindow() {
    // Perform any cleanup actions before closing the window
    console.log("Closing Quill editor and window");
    // quill.destroy(); // Destroy the Quill editor
    window.close(); // Close the window
  }
  if (!newWindow) return;
  // Load content from local storage if available
  // load only once  the product name in the url matches the product name in the local storage 


  var savedContent = localStorage.getItem("productContent");
  console.log("savedContent: \n\n\n", savedContent);
  if (savedContent) {
    quill.root.innerHTML = savedContent;
  }
  //TODO add elements into the DB
  // Function to save content to local storage
   function saveContent() {
    // if (!newWindow) {
    //   return;
    // }
    // Get the HTML content from the editor
    var content = quill.root.innerHTML;
    console.log("content:\n\n\n ", content);
    localStorage.setItem("productContent", content);
    var productName = localStorage.getItem("productName");
    // const apiURL = "http://localhost:5001/product/edit";
    const apiURL =      `${host}/product/edit`;

    const data = {
      productName: productName,
      content: content,
    };
    console.log("data: ", data);
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
          console.log("response error : ", response);
          alert("internal sever error please call the admin");
          throw new Error("Network response was not ok");
        } else {
          console.log("response my   : ", response);
          // Save content to local storage using the provided key
          localStorage.setItem("productContent", content);
          div.innerHTML = content;
        }
        // the response used .send in backend
      });

    // Optionally, provide feedback to the user
  }

  // Expose the saveContent function for external use
  return { saveContent, closeEditorAndWindow };
}

// create edit area accessible
const editArea = document.getElementById("editor");
const editBtn = document.getElementById("editBtn" + productName);
const saveBtn = document.getElementById("saveButton" + productName);
console.log(saveBtn);
editBtn.addEventListener("click", () => {
  editArea.classList.toggle("active");
  saveBtn.classList.toggle("active");
  var newContent = localStorage.getItem("productContent");

  quill.root.innerHTML = newContent ;

  // document.body.style.overflowY =
  //   document.body.style.overflowY === "hidden" ? "auto" : "hidden";
});



