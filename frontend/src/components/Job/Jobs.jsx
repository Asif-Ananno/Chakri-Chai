import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";


const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="filter-box">
          <label htmlFor="category" style={{ fontWeight: 'bold' }}>Filter by Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">All jobs</option>
            <option value="Graphics & Design">Graphics & Design</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Frontend Web Development">Frontend Web Development</option>
            <option value="MERN Stack Development">MERN STACK Development</option>
            <option value="Account & Finance">Account & Finance</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Video Animation">Video Animation</option>
            <option value="MEAN Stack Development">MEAN STACK Development</option>
            <option value="MEVN Stack Development">MEVN STACK Development</option>
            <option value="Data Entry Operator">Data Entry Operator</option>

          </select>
        </div>
        <div className="search-box">
        <label htmlFor="serach" style={{ fontWeight: 'bold' }}>Search jobs: </label>
          <input
            type="text"
            placeholder="Search jobs by title"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="search-input"
          />
        </div>
        <div className="banner">
          {jobs.jobs &&
            jobs.jobs
              .filter((job) =>
                selectedCategory ? job.category === selectedCategory : true
              )
              .filter((job) =>
                searchQuery
                  ? job.title.toLowerCase().includes(searchQuery.toLowerCase())
                  : true
              )
              .map((element) => {
                return (
                  <div className="card" key={element._id}>
                    <p>{element.title}</p>
                    <p>{element.category}</p>
                    <p>{element.country}</p>
                    <Link to={`/job/${element._id}`}>Job Details</Link>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;