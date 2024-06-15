import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useLocation } from "react-router-dom";
import "./CompanyDetails.css";
import Header from "./components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
const CompanyDetails = () => {
  const { id, name } = useParams();
  const [company, setCompany] = useState(null);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/details/${id}`
        );
        setCompany(response.data);
      } catch (error) {
        console.error("Error fetching company details", error);
      }
    };

    fetchCompanyDetails();
  }, [id, name]);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="company-details">
      <div className="company-header">
        <Header />
        <nav className="breadcrumbs">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              return (
                <li key={to}>
                  <Link to={to}>{value}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="company-hero">
        <div className="company-info">
          <img
            src={company.companyLogo}
            alt="Company Logo"
            className="company-detail-logo"
          />
          <p className="name-description">
            <h1>{company.name}</h1>
            <p className="description">
              <FontAwesomeIcon icon={""} /> Description
              <p>{company.description}</p>
            </p>
          </p>
          <p className="contact-details">
            <p className="phone">
              <FontAwesomeIcon icon={""} /> Phone
              <p>{company.phoneNumber}</p>
            </p>
            <p className="email">
              <FontAwesomeIcon icon={""} /> Email <p>{company.email}</p>
            </p>
          </p>
        </div>
      </div>
      <div className="company-body">
        <div className="details">
          <h2>Company Details</h2>
          <p>
            <span>Website:</span> {company.website}
          </p>
          <p>
            <span>Email:</span> {company.email}
          </p>
          <p>
            <FontAwesomeIcon icon={faFacebook} />
            <span>Facebook:</span>
            <Link to={company.facebookUrl}>{company.facebookUrl}</Link>
          </p>
          <p>
            <FontAwesomeIcon icon={faInstagram} />
            <span>Instagram:</span>
            <Link to={company.instagramUrl}>{company.instagramUrl}</Link>
          </p>
          <p>
            <FontAwesomeIcon icon={faTwitter} />
            <span>Twitter:</span>
            <Link to={company.twitterUrl}>{company.twitterUrl}</Link>
          </p>
          <p>
            <FontAwesomeIcon icon={faLinkedin} />
            <span>LinkedIn:</span>
            <Link to={company.linkedinUrl}>{company.linkedinUrl}</Link>
          </p>
          <p>
            <span>Address:</span> {company.address}
          </p>
        </div>
        <div className="screenshot">
          <h2>Screenshot of Webpage</h2>
          <img src={company.screenshotUrl} alt="Screenshot" />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
