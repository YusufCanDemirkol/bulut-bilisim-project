const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const linkContainer = document.getElementById("linkContainer");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        linkContainer.innerHTML = `<p>Download Link: <a href="${data.link}" target="_blank">${data.link}</a></p>`;
    }
});
