import React, { Component } from "react";
import axios from "axios";
import FormData from "form-data";
import "./AddPost.css";



class AddPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      author: "",
      post: "",
      image: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleImageChange = e => {
    e.preventDefault();
    let imageFile = e.target.files[0];
    this.setState({ [e.target.name]: imageFile });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { title, author, post, image } = this.state;   
    const formData = new FormData();
    formData.set("title", title);
    formData.set("post", post);
    formData.set("author", author);
    formData.append("image", image);
    axios({
      method: "post",
      url: "http://localhost:4000/api/v1/post/add",
      data: formData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    }).then(res => {
        console.log(res);
        if (res.status === 200) {
          this.props.history.replace("/");
        }
      });
  };

  render() {
    const { title, author, post, image } = this.state;
    return (
      <div>
        <div className="container">
          <h2> Create New Post </h2>
          <form onSubmit={this.handleSubmit} encType="multipart/formdata">
            <div className="form-group">
              <label for="title">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Title"
                name="title"
                value={title}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label for="author">Author</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                name="author"
                value={author}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label for="post">Post</label>
              <textarea
                className="form-control"
                placeholder="Enter Post"
                name="post"
                value={post}
                onChange={this.handleChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label for="title">Image</label>
              <input
                type="file"
                name="image"
                id="image"
                value={image}
                onChange={this.handleImageChange}
              />
            </div>
            <button
              className="form-control btn-primary"
              type="submit"
              onClick={this.handleSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddPost;
