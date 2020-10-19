// import _ from "lodash";
import React from "react";
import Datasheet from "./components/Datasheet";
import axios from "axios";
import "./components/react-datasheet.css";

export default class BasicSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [
        [{ value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }],
      ],
      dataset: [],
      data: [],
    };
  }
  valueRenderer = (cell) => cell.value;
  onCellsChanged = (changes) => {
    const grid = this.state.grid;
    changes.forEach(({ cell, row, col, value }) => {
      grid[row][col] = { ...grid[row][col], value };
    });
    changes.forEach(({ cell, row, col, value }) => {
      axios.post("http://127.0.0.1:8080/api/table", {
        y: row,
        x: col,
        post: value,
      });
    });
    this.setState({ grid });
  };
  onContextMenu = (e, cell, i, j) =>
    cell.readOnly ? e.preventDefault() : null;

  componentDidMount() {
    fetch("http://127.0.0.1:8080/api/table")
      .then((response) => {
        if (response.status > 400) {
        }
        return response.json();
      })
      .then((result) => {
        this.setState(
          {
            data: result,
          },
          () => {
            this.load_data();
          }
        );
      });
    let dataset = [];
    let base = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        dataset.push({ value: "" });
      }
      base.push(dataset);
      dataset = [];
    }
    if (this.state.grid !== base) {
      this.setState({ grid: base });
    }
  }

  load_data() {
    let newGrid = this.state.grid;
    if (this.state.data.length > 0) {
      for (let i = 0; i < this.state.data.length; i++) {
        let row = this.state.data[i]["y"];
        let col = this.state.data[i]["x"];

        let newValue = this.state.data[i]["post"];
        let newGrid = this.state.grid;

        newGrid[row][col] = { value: newValue };

        if (this.state.grid !== newGrid) {
          this.setState({ grid: newGrid });
        }
      }
    }
  }

  render() {
    return (
      <Datasheet
        data={this.state.grid}
        valueRenderer={this.valueRenderer}
        onContextMenu={this.onContextMenu}
        onCellsChanged={this.onCellsChanged}
      />
    );
  }
}
