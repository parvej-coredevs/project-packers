export default function productInvoice({
  name,
  requestID,
  seller_takes,
  sales_taxs,
  packers_fee,
  quantity,
  delivery,
}) {
  // console.log(data);
  return `
  <!DOCTYPE html>
<html>
  <head>
    <title>Product Invoice</title>
    <style></style>
  </head>
  <body>
    <div style="background-color: #bfd8ff">
      <div
        style="
          background: #fff;
          background-color: #fff;
          margin: 0 auto;
          max-width: 600px;
        "
      >
        <table
          role="presentation"
          style="background: #fff; background-color: #fff; width: 100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          align="center"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0;
                  padding: 0;
                  padding-bottom: 0;
                  padding-left: 0;
                  padding-right: 0;
                  padding-top: 0;
                  text-align: center;
                "
              >
                <div
                  style="
                    background: #1b2e35;
                    background-color: #1b2e35;
                    margin: 0 auto;
                    max-width: 600px;
                  "
                >
                  <table
                    role="presentation"
                    style="
                      background: #1b2e35;
                      background-color: #1b2e35;
                      width: 100%;
                    "
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    align="center"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            border: 0 solid transparent;
                            direction: ltr;
                            font-size: 0;
                            padding: 20px 0;
                            padding-bottom: 24px;
                            padding-left: 16px;
                            padding-right: 16px;
                            padding-top: 16px;
                            text-align: center;
                          "
                        >
                          <div
                            class="mj-column-per-100 mj-outlook-group-fix"
                            style="
                              font-size: 0;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      background-color: transparent;
                                      border: 0 solid transparent;
                                      vertical-align: top;
                                      padding-top: 0;
                                      padding-right: 0;
                                      padding-bottom: 0;
                                      padding-left: 0;
                                    "
                                  >
                                    <table
                                      role="presentation"
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 10px;
                                              padding-right: 0;
                                              padding-bottom: 0;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 30px;
                                                font-weight: 600;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #fff;
                                              "
                                            >
                                              <p style="text-align: center">
                                                <span
                                                  style="
                                                    font-family: Helvetica,
                                                      serif;
                                                  "
                                                  >HERE IS YOUR INVOICE</span
                                                >
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 0;
                                              padding-right: 50px;
                                              padding-bottom: 0;
                                              padding-left: 50px;
                                              word-break: break-word;
                                            "
                                          >
                                            <p
                                              style="
                                                border-top: solid 2px #b6b1b1;
                                                font-size: 1px;
                                                margin: 0 auto;
                                                width: 100%;
                                              "
                                            ></p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div style="
                    background: #fff;
                    background-color: #fff;
                    margin: 0 auto;
                    max-width: 600px;
                  "
                >
                  <table
                    role="presentation"
                    style="
                      background: #fff;
                      background-color: #fff;
                      width: 100%;
                    "
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    align="center"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            border: 0 solid transparent;
                            direction: ltr;
                            font-size: 0;
                            padding: 20px 0;
                            padding-bottom: 0;
                            padding-left: 16px;
                            padding-right: 0;
                            padding-top: 0;
                            text-align: center;
                          "
                        >
                          <div
                            class="mj-column-per-49 mj-outlook-group-fix"
                            style="
                              font-size: 0;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      background-color: #fff;
                                      border: 0 solid #fff;
                                      vertical-align: top;
                                      padding-top: 0;
                                      padding-right: 0;
                                      padding-bottom: 0;
                                      padding-left: 10px;
                                    "
                                  >
                                    <table
                                      role="presentation"
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 40px;
                                              padding-right: 0;
                                              padding-bottom: 15px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 500;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #4a4a4a;
                                              "
                                            >
                                              <p>
                                                <strong>Product :</strong> ${name}
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 0;
                                              padding-right: 0;
                                              padding-bottom: 15px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 500;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #4a4a4a;
                                              "
                                            >
                                              <p>
                                                <strong>Requst ID : </strong>
                                                #${requestID}
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 0;
                                              padding-right: 0;
                                              padding-bottom: 15px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 500;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #4a4a4a;
                                              "
                                            >
                                              <p>
                                                <strong
                                                  >Seller Takes :</strong
                                                > ${seller_takes}
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 0;
                                              padding-right: 0;
                                              padding-bottom: 15px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 500;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #4a4a4a;
                                              "
                                            >
                                              <p>
                                                <strong>Sales Taxs :</strong> ${sales_taxs}
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 0;
                                              padding-right: 0;
                                              padding-bottom: 24px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 500;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #4a4a4a;
                                              "
                                            >
                                              <p>
                                                <strong>Packers Fee :</strong> ${packers_fee}
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 0;
                                              padding-right: 0;
                                              padding-bottom: 24px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 500;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #4a4a4a;
                                              "
                                            >
                                              <p>
                                                <strong>Quantity :</strong>
                                                ${quantity}
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 0;
                                              padding-right: 0;
                                              padding-bottom: 24px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 500;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #4a4a4a;
                                              "
                                            >
                                              <p>
                                                <strong>Aproximate Delivery :</strong>
                                                Within ${delivery}
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div
                            class="mj-column-per-49 mj-outlook-group-fix"
                            style="
                              font-size: 0;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      background-color: transparent;
                                      border: 0 solid transparent;
                                      vertical-align: top;
                                      padding-top: 0;
                                      padding-right: 0;
                                      padding-bottom: 0;
                                      padding-left: 0;
                                    "
                                  >
                                    <table
                                      role="presentation"
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 0;
                                              padding-top: 0;
                                              padding-right: 0;
                                              padding-bottom: 0;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="right"
                                          >
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                  style="
                    background: #1b2e35;
                    background-color: #1b2e35;
                    margin: 0 auto;
                    max-width: 600px;
                  "
                >
                  <table
                    role="presentation"
                    style="
                      background: #1b2e35;
                      background-color: #1b2e35;
                      width: 100%;
                    "
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    align="center"
                  >
                    <tbody>
                      <tr>
                        <td
                          style="
                            border: 11px solid #fff;
                            direction: ltr;
                            font-size: 0;
                            padding: 20px 0;
                            padding-bottom: 16px;
                            padding-left: 16px;
                            padding-right: 16px;
                            padding-top: 20px;
                            text-align: center;
                          "
                        >
                          <div
                            class="mj-column-per-49 mj-outlook-group-fix"
                            style="
                              font-size: 0;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      background-color: transparent;
                                      border: 0 solid #fff;
                                      vertical-align: top;
                                      padding-top: 0;
                                      padding-right: 0;
                                      padding-bottom: 0;
                                      padding-left: 0;
                                    "
                                  >
                                    <table
                                      role="presentation"
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 10px 25px;
                                              padding-top: 10px;
                                              padding-right: 0;
                                              padding-bottom: 24px;
                                              padding-left: 0;
                                              word-break: break-word;
                                            "
                                            align="left"
                                          >
                                            <div
                                              style="
                                                font-family: Helvetica;
                                                font-size: 16px;
                                                font-weight: 600;
                                                letter-spacing: 0;
                                                line-height: 1.5;
                                                text-align: left;
                                                color: #fff;
                                              "
                                            >
                                              <p style="text-align: center">
                                                Know More about your order&nbsp;
                                              </p>
                                              <p style="text-align: center">
                                                by clicking here&nbsp;
                                              </p>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div
                            class="mj-column-per-49 mj-outlook-group-fix"
                            style="
                              font-size: 0;
                              text-align: left;
                              direction: ltr;
                              display: inline-block;
                              vertical-align: top;
                              width: 100%;
                            "
                          >
                            <table
                              role="presentation"
                              width="100%"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      background-color: transparent;
                                      border: 0 solid transparent;
                                      vertical-align: top;
                                      padding-top: 0;
                                      padding-right: 0;
                                      padding-bottom: 0;
                                      padding-left: 0;
                                    "
                                  >
                                    <table
                                      role="presentation"
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                      border="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            style="
                                              font-size: 0;
                                              padding: 20px 0 12px 0;
                                              word-break: break-word;
                                            "
                                            align="center"
                                          >
                                            <table
                                              role="presentation"
                                              style="
                                                border-collapse: separate;
                                                width: auto;
                                                line-height: 100%;
                                              "
                                              cellspacing="0"
                                              cellpadding="0"
                                              border="0"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    role="presentation"
                                                    style="
                                                      border-radius: 4px;
                                                      border: 0 solid none;
                                                      cursor: auto;
                                                      height: auto;
                                                      background: #fff;
                                                      padding: 12px 24px 12px
                                                        24px;
                                                    "
                                                    bgcolor="#ffffff"
                                                    align="center"
                                                  >
                                                    <div
                                                      style="
                                                        display: inline-block;
                                                        background: #fff;
                                                        color: #000;
                                                        font-family: Helvetica;
                                                        font-size: 14px;
                                                        font-weight: 400;
                                                        line-height: 1;
                                                        letter-spacing: 1px;
                                                        margin: 0;
                                                        text-decoration: none;
                                                        text-transform: none;
                                                        padding: 0;
                                                        border-radius: 4px;
                                                      "
                                                    >
                                                      Know More
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  on="tap:AMP.setState({form2atmo0: {fuuid: form2atmo0.fuuid || floor(random() * 100000) }})"
                  role="tab"
                  tabindex="1"
                  class="amp-form-block form2atmo0-wrapper"
                  style="margin: auto; text-align: left"
                >
                  <div class="data">
                    <amp-state
                      id="form2atmo0"
                      class="i-amphtml-element i-amphtml-layout-container i-amphtml-built"
                      i-amphtml-layout="container"
                      aria-hidden="true"
                      hidden=""
                      ><script type="application/json">
                        {
                          "currentStep": "stepfb4t50",
                          "responses": {},
                          "formHistory": []
                        }
                      </script></amp-state
                    >
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>
  `;
}
