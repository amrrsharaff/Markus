import React from 'react';
import {render} from 'react-dom';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import treeTableHOC from 'react-table/lib/hoc/treeTable';
import {SubmissionFileManager} from "./submission_file_manager";

const TreeTable = treeTableHOC(ReactTable);
const makeDefaultState = () => ({
  data: [],
  sorted: [{id: 'test_batch_id', desc: true}],
  newData: []
});

class BatchTestRunTable extends React.Component {

  constructor() {
    super();
    this.state = makeDefaultState();
    this.fetchData = this.fetchData.bind(this);
    this.addButtons = this.addButtons.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    console.log("fetch data start");
    $.ajax({
      url: Routes.batch_runs_assignment_path(
        this.props.assignment_id),
      dataType: 'json',
    }).then(res => {
      this.setState({data: res});
    });
    console.log("fetch data end");
  }

  addButtons(){
    var newData = this.state.data;
    console.log(newData[0]);
    for(let i = 0; i < this.state.data.length; i++){
      if(newData[i].status === "complete"){
        const stop_tests_url = Routes.stop_tests_assignment_path(this.props.assignment_id);
        newData[i].action = <a href={stop_tests_url}>Stop test {newData[i].id}</a>;
        const result_url = Routes.edit_assignment_submission_result_path(this.props.assignment_id,newData[i].result_id,newData[i].result_id);
        newData[i].group_name = <a href={result_url}>{newData[i].group_name}</a>;
      }
    }
    this.setState({newData: newData});
  }

  render() {
    console.log("render");
    var {data} = this.state;
    // Set the row map to expand the latest test run when the webpage is loaded

    return(
      <div>
        <ReactTable
          data={this.state.newData}
          columns={[
            {
              Header: "Batch Test ID",
              accessor: "test_batch_id"
            },
            {
              Header: "Date/Time",
              accessor: "created_at",
              Aggregated: <span></span>
            },
            {
              Header: "Group Name",
              accessor: "group_name",
              Aggregated: <span></span>
            },
            {
              Header: "Estimated Remaining Time",
              accessor: 'time_to_service_estimate',
              Aggregated: <span></span>
            },
            {
              Header: "Status",
              accessor: 'status',
              Aggregated: <span><a href={"www.google.com"}>Stop This batch</a></span>
            }
          ]}
          pivotBy={["test_batch_id"]}
          // Controlled props
          sorted={this.state.sorted}
          // Callbacks
          onSortedChange={sorted => this.setState({ sorted })}
          // Custom Sort Method to sort by latest batch run
          defaultSortMethod={ (a, b) => {
            // sorting for created_at_user_name to ensure it's sorted by date
            if (this.state.sorted[0].id === 'test_batch_id') {
              if (a === 'Individual Tests'){
                return -1;
              }else if (b === 'Individual Tests'){
                return 1;
              }else{
                return parseInt(a) > parseInt(b) ? 1: -1
              }
            } else {
              return a > b ? 1 : -1;
            }
          }}
          onFetchData={this.addButtons}
        />
      </div>
    );
  }
}

export function makeBatchTestRunTable(elem, props) {
  render(<BatchTestRunTable {...props}/>, elem);
}
