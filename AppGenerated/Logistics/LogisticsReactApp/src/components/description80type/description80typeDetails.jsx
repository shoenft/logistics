import React, { Component } from "react";
import { getDescription80type } from "../../services/description80typeService";

class Description80typeDetails extends Component{

  state = {
    data: { id: "", languageCode: "", codeListVersion: "", },
    errors: {}
  };

  async populateForm() {
    try {
        const description80typeId = this.props.match.params.id;
        const { data } = await getDescription80type(description80typeId);
        this.setState({ data });
    } 
    catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found"); 
      }
    }
  }

  async componentDidMount() {
    await this.populateForm();
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.props.history.push("/description80types");
  };

  render() {
    return (
      <div className="content">
        <h1>Description80type Details</h1>
        <form onSubmit={this.handleSubmit}>

          <div className="form-group">
              <label  className="form-control"> Id : 
                 {this.state.data["id"]}
              </label>
          </div>
          <div className="form-group">
              <label  className="form-control"> Language Code : 
                 {this.state.data["languageCode"]}
              </label>
          </div>
          <div className="form-group">
              <label  className="form-control"> Code List Version : 
                 {this.state.data["codeListVersion"]}
              </label>
          </div>
           <button className="btn btn-primary custom-btn">OK</button>

        </form>
      </div>
    );
  }
}

export default Description80typeDetails;