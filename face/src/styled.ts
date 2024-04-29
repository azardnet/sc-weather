import styled from "styled-components";
export const AppWrapper = styled.section`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;

  .t-main {
    background-color: rgb(255 255 255 / 10%);
    position: relative;
    width: 325px;
    height: 220px;
    box-shadow: 10px 8px 14px -4px rgb(0 0 0 / 16%),
      4px 4px 0px 1px rgb(255 255 255 / 10%);
    border: 1px solid rgb(255 255 255 / 15%);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
  }

  .t-main:before {
    content: "";
    position: absolute;
    width: 26px;
    height: 26px;
    background-color: rgb(145, 132, 69);
    top: -13px;
    left: -15px;
    border-right: 1px dashed rgba(255, 255, 255, 0.3);
    border-radius: 1px;
    transform: rotate(43deg);
  }
  .t-main {
    header {
      position: relative;
      width: 100%;
      &:before {
        content: "";
        position: absolute;
        top: 18px;
        width: 100%;
        height: 1px;
        background-color: rgb(255 255 255 / 15%);
      }
      &:after {
        content: "";
        position: absolute;
        top: 0px;
        background: rgb(255 255 255 / 5%);
        width: 35px;
        height: 18px;
        border: 0;
        left: 0px;
        z-index: -1;
        box-shadow: 7px 0px 8px -6px rgb(0 0 0 / 15%);
      }
      img {
        position: absolute;
        right: 0px;
        z-index: -1;
        top: 0px;
        height: 18px;
        opacity: 0.4;
      }
      h1 {
        color: rgb(255, 255, 255);
        font-size: 24px;
        line-height: 19px;
        letter-spacing: 0px;
        text-align: center;
        margin: 0px;
        padding-left: 18px;
        text-transform: uppercase;
        text-shadow: 1px 0px 0px rgb(0 0 0 / 30%), 0px 0px 2px rgb(0 0 0 / 11%);
        width: 80%;
        overflow: hidden;
        margin-right: auto;
        margin-left: auto;
        text-overflow: ellipsis;
      }
      button {
        position: absolute;
        top: 0px;
        background: transparent;
        width: 35px;
        height: 18px;
        border: 0;
        left: 0px;
        cursor: pointer;
        svg {
          width: 80%;
          height: 80%;
          margin-left: 8px;
          margin-top: 2px;
          path {
            fill: #fff;
          }
        }
      }
    }
    section {
      display: flex;
      width: 100%;
      padding: 8px 0px 8px 8px;
      box-sizing: border-box;
      position: relative;
      border-bottom: 1px solid rgb(255 255 255 / 20%);
      .temperature {
        .feels-like {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 13px;
          top: 60px;
          svg {
            width: 16px;
            height: 16px;
            margin-top: 5px;
            margin-right: 0px;
            path {
              fill: #fff;
            }
          }
          .value {
            position: relative;
            strong {
              font-size: 10px;
            }
            span {
              position: absolute;
              font-size: 6px;
              top: 6px;
            }
          }
        }
        .main-value {
          strong {
            font-size: 28px;
            letter-spacing: -1px;
            text-shadow: 0px 0px 1px rgb(0 0 0 / 30%);
          }
          span {
            font-size: 10px;
            display: inline-block;
            transform: translate(2px, -14px);
          }
        }
        .weather-state {
          font-size: 11px;
          margin-top: -8px;
          margin-bottom: 0px;
        }
        > svg {
          position: absolute;
          top: 10px;
          right: 8px;
          width: 38px;
          height: 38px;
        }
        .max-min {
          display: flex;
          > span {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            &:last-of-type {
              margin-left: 14px;
            }
            > div {
              position: relative;
            }
            strong {
              font-size: 10px;
            }
            span {
              font-size: 6px;
              position: absolute;
              right: -7px;
              top: 6px;
            }
            svg {
              path {
                stroke: #fff;
                stroke-width: 3px;
              }
              width: 10px;
              height: 10px;
              margin-right: 4px;
              margin-top: 2px;
            }
          }
        }
      }
    }
    .temp-more-details {
      display: flex;
      div {
        svg {
          path {
            fill: #fff;
          }
        }
      }
    }
  }
`;
