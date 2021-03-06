import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { Table } from "antd";
import moment from "moment";

import ArtistsCard from "./ArtistsCard";

import "./SearchTable.css";
const getDate = text => moment(text).format("DD/MM/YYYY");

const getDuration = text => {
  const minutes = moment.duration(text).minutes() + "";
  const seconds = moment.duration(text).seconds() + "";
  return minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0");
};

const sort = (itemA, itemB) => {
  if (itemA > itemB) return 1;
  if (itemA < itemB) return -1;
  return 0;
};

const getPriceWithoutUnits = priceWithUnits => {
  const priceWithoutUnitsAsText = priceWithUnits.substr(
    0,
    priceWithUnits.indexOf(" ")
  );
  const priceWithoutUnits = parseFloat(priceWithoutUnitsAsText);
  return priceWithoutUnits;
};

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    className: "SearchTableTitle",
    sorter: (a, b) => sort(a.title, b.title)
  },
  {
    title: "Artist",
    dataIndex: "artist",
    key: "artist",
    className: "SearchTableArtist",
    sorter: (a, b) => sort(a.artist, b.artist)
  },
  {
    title: "Album title",
    dataIndex: "album",
    key: "album",
    className: "SearchTableAlbum",
    sorter: (a, b) => sort(a.album, b.album)
  },
  {
    title: "Release date",
    dataIndex: "release",
    key: "release",
    className: "SearchTableRelease",
    render: getDate,
    sorter: (a, b) => sort(a.release, b.release)
  },
  {
    title: "Cover",
    dataIndex: "bigCover",
    key: "bigCover",
    className: "SearchTableCover",
    render: (text, record) => (
      <img alt={record.title} src={text} style={{ width: 60 }} />
    )
  },
  {
    title: "Lenght",
    dataIndex: "lenght",
    key: "lenght",
    className: "SearchTableLenght",
    render: getDuration,
    sorter: (a, b) => sort(a.lenght, b.lenght)
  },
  {
    title: "Genre",
    dataIndex: "genre",
    key: "genre",
    className: "SearchTableGenre",
    sorter: (a, b) => sort(a.genre, b.genre)
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    className: "SearchTablePrice",
    sorter: (a, b) =>
      sort(getPriceWithoutUnits(a.price), getPriceWithoutUnits(b.price))
  }
];

class SearchTable extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  goToDetail(id, dataSource) {
    this.context.router.history.push({
      pathname: "/detail",
      search: `?id=${id}`,
      state: { dataSource }
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      isTable: true,
      currentPage: 1,
      itemsPerPage: 20
    };
  }
  handleTableSwitch() {
    this.setState({ isTable: !this.state.isTable });
  }

  handleClick = event => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  };

  render() {
    const { isLoading, dataSource } = this.props;
    const isTable = this.state.isTable;
    const { currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataSource.slice(indexOfFirstItem, indexOfLastItem);

    const renderItems = currentItems.map((item, index) => (
      <ArtistsCard key={index} {...item} />
    ));
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(dataSource.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          className="pagination-items"
          key={number}
          id={number}
          onClick={this.handleClick}
        >
          {number}
        </li>
      );
    });

    let table;
    let button;
    if (isTable) {
      table = (
        <Table
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 20 }}
          onRow={record => {
            return {
              onClick: () => this.goToDetail(record.key, dataSource)
            };
          }}
        />
      );
    } else {
      table = (
        <div className="SearchTable">
          <div className="ui link cards">{renderItems}</div>
          <div className="pagination">
            <ul className="page-numbers">{renderPageNumbers}</ul>
          </div>
        </div>
      );
    }
    return (
      <div>
        <button
          className="switch-button"
          onClick={() => this.handleTableSwitch()}
        >
          {" "}
          {this.state.isTable ? "Switch to Grid View" : "Switch to Table View"}
        </button>
        {table}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.search
  };
};

export default connect(mapStateToProps)(SearchTable);
