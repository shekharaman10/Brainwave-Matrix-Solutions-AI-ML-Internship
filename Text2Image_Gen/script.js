const token = "Your API key from hugging face";

const inputTxt = document.getElementById("input");
const button = document.getElementById("btn");
const image = document.getElementById("image");

async function query() {
    image.src = "/loading.gif"; // Show loading animation
    image.style.display = "block"; // Ensure image is visible

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { Authorization: `Bearer ${token}` },
                method: "POST",
                body: JSON.stringify({ inputs: inputTxt.value }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        return await response.blob();
    } catch (error) {
        console.error("Error fetching from Hugging Face API:", error);
        throw error;
    }
}

button.addEventListener("click", async function () {
    if (inputTxt.value.trim() === "") {
        alert("⚠️ Please enter a valid text prompt!");
        return;
    }

    // Show loading animation and disable UI elements
    button.innerHTML = `<span class="spinner"></span> Generating...`;
    button.classList.add("loading");
    button.disabled = true;
    inputTxt.disabled = true;
    image.src = "/loading.gif"; // Reset to loading animation

    try {
        const response = await query();
        const objectURL = URL.createObjectURL(response);
        image.src = objectURL;
        image.style.display = "block"; // Ensure the image is visible
    } catch (error) {
        image.src = ""; // Clear image if there's an error
        alert("❌ Failed to generate image. Please try again!");
    } finally {
        // Re-enable UI elements
        button.innerHTML = "Generate";
        button.classList.remove("loading");
        button.disabled = false;
        inputTxt.disabled = false;
    }
});
