import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(new Set());

  // Fetch data from the database when the component mounts
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

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

  const handleExport = () => {
    const selectedData = Array.from(selected).map((index) => data[index]);
    const csvContent = `data:text/csv;charset=utf-8,${[
      [
        "Name",
        "Description",
        "Company Logo",
        "Facebook URL",
        "LinkedIn URL",
        "Twitter URL",
        "Instagram URL",
        "Address",
        "Phone Number",
        "Email",
      ],
      ...selectedData.map((item) => [
        item.name,
        item.description,
        item.companyLogo,
        item.facebookUrl,
        item.linkedinUrl,
        item.twitterUrl,
        item.instagramUrl,
        item.address,
        item.phoneNumber,
        item.email,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n")}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scraped_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleDelete = async () => {
    const idsToDelete = Array.from(selected).map((index) => data[index]._id);
    try {
      await axios.post("http://localhost:5001/api/delete", {
        ids: idsToDelete,
      });
      setData(data.filter((_, index) => !selected.has(index)));
      setSelected(new Set());
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  return (
   
    <div className="app-container">
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

      <div className="action-buttons">
        <button
          onClick={handleDelete}
          disabled={selected.size === 0}
          className="delete-button">
          Delete
        </button>
        <button
          onClick={handleExport}
          disabled={selected.size === 0}
          className="export-button">
          Export as CSV
        </button>
      </div>

      {/* {data.length > 0 && ( */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Company</th>
                <th>Social Profiles</th>
                <th>Description</th>
                <th>Address</th>
                <th>Phone No.</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(index)}
                      onChange={() => {
                        const newSelected = new Set(selected);
                        if (newSelected.has(index)) newSelected.delete(index);
                        else newSelected.add(index);
                        setSelected(newSelected);
                      }}
                    />
                  </td>
                  <td>
                    <div className="company-info">
                      <Link to={`/${item._id}`} className="company-name">
                      <img
                        src={item.companyLogo}
                        alt="logo"
                        className="company-logo"
                      />
                      <span>{item.name}</span>
                      </Link>
                    </div>
                  </td>
                  <td className="social-profiles">
                    <div className="social-icons">
                    {item.facebookUrl && (
                      <Link
                        to={item.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} />
                      </Link>
                    )}
                    {item.linkedinUrl && (
                      <Link
                        to={item.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} />
                      </Link>
                    )}
                    {item.twitterUrl && (
                      <Link
                        to={item.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                      </Link>
                    )}
                    {item.instagramUrl && (
                      <Link
                        to={item.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} />
                      </Link>
                    )}
                    </div>
                  </td>
                  <td>
                    {item.description.split(" ").slice(0, 8).join(" ")}
                    {item.description.split(" ").length > 8 && " ..."}
                  </td>
                  <td>{item.address}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {/* )} */}
    </div>
  );
}

export default Home;
