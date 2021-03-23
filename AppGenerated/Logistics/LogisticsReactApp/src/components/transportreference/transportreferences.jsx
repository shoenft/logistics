import React, { Component } from "react";
import Pagination from "../common/Pagination";
import { paginate } from "../../utils/paginate";
import { Link } from "react-router-dom";
import { getTransportreferences, deleteTransportreference } from "../../services/transportreferenceService";

class Transportreferences extends Component{
  state = {
    records: [],
    pageSize: 20,
    currentPage: 1
  };

  async componentDidMount() {
    const { data:transportreferences } = await getTransportreferences();
    this.setState({ records:transportreferences });
  }

  handleDelete = async id => {
    const alltransportreferences = this.state.records; 
    const transportreferences = alltransportreferences.filter(m => m._id !== id);
    this.setState({ records:transportreferences });
    try {
      await deleteTransportreference(id);
      console.log("Record Successfully deleted.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
         console.log("The record has already been deleted");
      }
      this.setState({ records: alltransportreferences });
    }
};


  handlePageChange = pageNo => {
    this.setState({ currentPage: pageNo });
  };

  getPagedData = () => {
    
    const {
      pageSize,
      currentPage,
      records
    } = this.state;
    
    const paginatedRecords = paginate(records, currentPage, pageSize);
    
    return { totalCount: !records.length ? 0 : records.length, data: paginatedRecords };
  
  };

  render() {

    const { totalCount, data: paginatedTransportreferences } = this.getPagedData();

    return (
      <React.Fragment>
            <div className="row mt-4">
              <div className="col-sm-5">
                    <Link
                      to="/transportreferences/new"
                      className="btn btn-primary custom-btn"
                      style={{ marginBottom: 20 }}
                    >
                     New Transportreference
                    </Link>
              </div>
              { (totalCount === 0)?
                <div className="col-sm-4">
                   <p>There are no records to show create a record</p>
                </div>
                : 
                <div className="col-sm-2">
                   <p>There are {totalCount} transportreferences</p>
                </div>
              }
          </div>
            <div className="table-responsive">

              <table className="table">
                <thead>
                    <tr>
                    <th scope="col" key="1" style={{ cursor: "pointer" }}>
                      Entity Identification
                    </th>
                    <th scope="col" key="2" style={{ cursor: "pointer" }}>
                      Creation Date Time
                    </th>
                    <th scope="col" key="3" style={{ cursor: "pointer" }}>
                      Revision Number
                    </th>
                    <th scope="col" key="4" style={{ cursor: "pointer" }}>
                      Line Item Number
                    </th>
                    <th scope="col" key="5" style={{ cursor: "pointer" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransportreferences.map(record => (
                    <tr key={record._id}>
                      <td key="1">{record.entityIdentification}</td>
                      <td key="2">{record.creationDateTime}</td>
                      <td key="3">{record.revisionNumber}</td>
                      <td key="4">{record.lineItemNumber}</td>
                      <td key="5">
                              <Link
                                to={`/viewtransportreference/${record._id}`}
                                className="btn btn-info btn-sm m-1"
                                >
                                View
                              </Link>
                              <Link
                                to={`/transportreferences/${record._id}`}
                                className="btn btn-warning btn-sm m-1"
                                >
                                Update
                              </Link>
                            <button
                              onClick={() => this.handleDelete(record._id)}
                              className="btn btn-danger btn-sm m-1"
                              >
                              Delete
                            </button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          
            <Pagination
              itemsCount={totalCount}
              pageSize={this.state.pageSize}
              onPageChange={this.handlePageChange}
              currentPage={this.state.currentPage}
            />
      </React.Fragment>
    );
  }
}
export default Transportreferences;
