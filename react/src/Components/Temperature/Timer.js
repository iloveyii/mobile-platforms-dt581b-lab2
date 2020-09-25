import React from "react";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0
    };
  }

  componentDidMount() {
    setInterval(() => {
      console.log("inside interval");
      const { timer } = this.state;
      let t = timer;
      if (t >= 6) {
        t = 0;
        this.props.fetchData();
      }
      t++;
      this.setState({ timer: t > 9 ? t : "0" + t });
    }, 1000);
  }

  render() {
    const { timer } = this.state;
    return (
      <div>
        <h4>Timer: {timer}</h4>
      </div>
    );
  }
}

export default Timer;
