import React, { useState } from 'react'
import axios from "axios";
const Header = () => {
    const [url, setUrl] = useState("");
    const [data, setData] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post("http://localhost:5001/api/scrape", {
            url,
          });
    
          setData((prevData) => [...prevData, response.data]);
          setUrl("");
        } catch (error) {
          console.error("Error scraping website", error);
        }
      };
  return (
    <div className="header">
        <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter domain name"
          className="input-box"
        />
        <button type="submit" className="fetch-button">
          Fetch & Save Details
        </button>
      </form>
    </div>
  )
}

export default Header