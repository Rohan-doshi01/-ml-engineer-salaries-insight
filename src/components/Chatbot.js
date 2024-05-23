import React, { useState } from "react";
import axios from "axios";

export default function ChatGPT() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const HTTP = "http://localhost:8000/api/generate-response";

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(HTTP, { message: prompt }) // Changed "prompt" to "message"
      .then((res) => {
        setResponse(res.data.response); // Accessing the "response" field
        console.log(prompt);
      })
      .catch((error) => {
        console.log(error);
      });

    setPrompt("");
  };

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="container container-sm p-1">
      <h1 className="title text-center text-darkGreen">ChatGPT API</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prompt">Ask questions</label>
          <input
            id="prompt"
            className="shadow-sm"
            type="text"
            placeholder="Enter text"
            value={prompt}
            onChange={handlePrompt}
          />
        </div>
        <button className="btn btn-accept w-100" type="submit">
          Go
        </button>
      </form>
      <div className="bg-darkGreen mt-2 p-1 border-5">
        <p className="text-light">
          {response ? response : "Ask me anything..."}
        </p>
      </div>
    </div>
  );
}
