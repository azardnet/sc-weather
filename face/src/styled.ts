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
    }
  }
`;
