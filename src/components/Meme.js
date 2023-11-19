import React, { useState, useEffect, useRef } from "react";

function Meme() {
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg",
    });

    const [allMemes, setAllMemes] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then((res) => res.json())
            .then((data) => setAllMemes(data.data.memes));
    }, []);

    function getRandomImage() {
        const memeImg = allMemes[Math.floor(Math.random() * allMemes.length)];
        let url = memeImg.url;

        setMeme((prevMeme) => ({
            ...prevMeme,
            randomImage: url,
        }));
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setMeme((prevMeme) => ({
            ...prevMeme,
            [name]: value,
        }));
    }

    function handleDownload() {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const image = new Image();
        image.crossOrigin = "Anonymous"; // Enable CORS for the image
        image.onload = () => {
            // Set canvas dimensions to match image
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw the image on the canvas
            context.drawImage(image, 0, 0);

           // Apply text styles to the canvas
        context.font = 'bold 40px impact, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const text = meme.topText.toUpperCase();
        const x = canvas.width / 2;
        const y = 50;

        // Draw the text with a shadow effect to create an outline
        context.fillStyle = 'black';
        for (let offsetX = -2; offsetX <= 2; offsetX++) {
            for (let offsetY = -2; offsetY <= 2; offsetY++) {
                if (offsetX !== 0 || offsetY !== 0) {
                    context.fillText(text, x + offsetX, y + offsetY);
                }
            }
        }

        // Draw the main text over the shadow to create the actual text
        context.fillStyle = 'white';
        context.fillText(text, x, y);

        // Repeat the same process for the bottom text

        const bottomText = meme.bottomText.toUpperCase();
        const bottomY = canvas.height - 50;

        // Draw the text with a shadow effect
        context.fillStyle = 'black';
        for (let offsetX = -2; offsetX <= 2; offsetX++) {
            for (let offsetY = -2; offsetY <= 2; offsetY++) {
                if (offsetX !== 0 || offsetY !== 0) {
                    context.fillText(bottomText, x + offsetX, bottomY + offsetY);
                }
            }
        }

        // Draw the main bottom text
        context.fillStyle = 'white';
        context.fillText(bottomText, x, bottomY);

            // Trigger download
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'meme.png';
            link.href = dataURL;
            link.click();
        };
        image.src = meme.randomImage;
    }

    return (
        <main>
            <div className="form">
                <input
                    type="text"
                    placeholder="Top text"
                    className="form-input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Bottom text"
                    className="form-input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button className="form-button" onClick={getRandomImage}>
                    Randomize 🆕
                </button>
                <button className="form-button download" onClick={handleDownload}>
                    Download Image 💾
                </button>
            </div>

            <div className="meme">
                <img src={meme.randomImage} className="meme-image" alt="meme" />
                <h2 className="meme-text top">{meme.topText}</h2>
                <h2 className="meme-text bottom">{meme.bottomText}</h2>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </main>
    );
}

export default Meme;