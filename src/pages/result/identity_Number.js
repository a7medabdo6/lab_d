import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo.png";

import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import TopHeader from "../../components/TopHeader";
import axios from "../../axios";
import { useHistory, useLocation } from "react-router-dom";
function Result() {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState([]);
  const router = useHistory();
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  console.log(query.get("customer_id"), "xiddd");
  const customer_id_query = query.get("customer_id");

  useEffect(async () => {
    console.log(router, "iddd");
    if (!customer_id_query) {
      return router.push("/");
    }
    try {
      const result = await axios.get(
        `customer/result?customer_id=${customer_id_query}`
      );
      console.log(result, "result");
      setSuccess(result.status == 200 ? true : false);
      setData(result.data);
    } catch (error) {
      console.log(error);
    }
  }, [customer_id_query]);

  return (
    <div>
      <div class="container">
        <div
          class="row"
          id="TEST"
          style={{
            flexWrap: "wrap-reverse",
            margin: "45px 0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 text-left ">
            <div class="test-txt2">PCR testing for SARS-CoV2 Test Result</div>
          </div>
          <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 text-left">
            <div class="test-txt">Speed Medical</div>
          </div>
          <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 text-center">
            <img style={{ width: "350px" }} src={logo} class="logo" />
          </div>
        </div>
        <div class="row" id="TEST">
          <div class="col-md-7 text-left order-2">
            <label class="label"> : Patient Name </label>
            <br />
            <label class="text-label">{data[0]?.username_en}</label>
          </div>
          <div class="col-md-5 text-right order-1">
            <div class="result-box result-nagative">{data[0]?.result}</div>
          </div>
        </div>

        <form dir="ltr" style={{ marginTop: "45px", marginBottom: "30px" }}>
          <div class="row">
            <div class="bg-div col-md-3 col-lg-3 col-sm-6 col-xs-6">
              <label class=" col-form-label label" for="Gender">
                Gender :
              </label>
              <br />
              <label class=" col-form-label text-label" id="Gender">
                {data[0]?.gender}
              </label>
            </div>

            <div class=" bg-div col-md-3 col-lg-3 col-sm-6 col-xs-6">
              <label class=" col-form-label label" for="DOB">
                Date Of Birth :
              </label>
              <br />
              <label class=" col-form-label text-label" id="DOB">
                {data[0]?.birth}
              </label>
            </div>

            <div class="bg-div  col-md-3 col-lg-3 col-sm-6 col-xs-6">
              <label class=" col-form-label label" for="Nationality">
                Nationality :
              </label>
              <br />
              <label class=" col-form-label text-label" id="Nationality">
                {data[0]?.nation}
              </label>
            </div>
            <div class="bg-div  col-md-3 col-lg-3 col-sm-6 col-xs-6">
              <label class=" col-form-label label" for="Passport">
                Passport No :
              </label>
              <br />
              <label class=" col-form-label text-label" id="Passport">
                {data[0]?.passport_Number}
              </label>
            </div>
          </div>

          <div class="row">
            <div class="bg-div col-md-3 col-lg-3 col-sm-6 col-xs-6">
              <label class=" col-form-label label" for="UaeID">
                ID No. :
              </label>
              <br />
              <label class=" col-form-label text-label" id="UaeID">
                {" "}
                {data[0]?.identity_Number}
              </label>
            </div>

            <div class="bg-div col-md-3 col-lg-3 col-sm-6 col-xs-6">
              <label class="col-form-label label">Patient Number : </label>
              <br />
              <label class="col-form-label text-label">
                {data[0]?.customer_id}{" "}
              </label>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6" style={{ height: "30px" }}></div>
          </div>

          <div class="row">
            <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <label class=" col-form-label label" for="RequestDate">
                Request Date :
              </label>
              <br />
              <label class=" col-form-label text-label" id="RequestDate">
                {" "}
                {data[0]?.reportDate}
              </label>
              <div class="div-line"></div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <label class=" col-form-label label" for="CollectionDate">
                Collection Date :
              </label>
              <br />
              <label class=" col-form-label text-label" id="CollectionDate">
                {data[0]?.collectDate}
              </label>
              <div class="div-line"></div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <label class=" col-form-label label" for="ReportingDate">
                Reporting Date :
              </label>
              <br />
              <label class=" col-form-label text-label" id="ReportingDate">
                {data[0]?.reportDate}{" "}
              </label>

              <div class="div-line"></div>
            </div>

            <div class="col-md-6 col-lg-6 col-sm-12 col-xs-12">
              <label class=" col-form-label label" for="AccNumber">
                Accession No :
              </label>
              <br />
              <label class=" col-form-label text-label" id="AccNumber">
                {data[0]?.id}{" "}
              </label>
              <div class="div-line"></div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
              <label class="Performed-txt" for="TestPerformedBy">
                Test Performed By :
              </label>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12">
              <label class="Performed-txt2" id="TestPerformedBy">
                Speed Medical - القاهرة - Egypt{" "}
              </label>
            </div>
          </div>
        </form>
      </div>
      <footer class="footer">
        <div class="container">
          <span class="footer-txt">
            Copyright © 2000-2021 National Technology Company, All rights
            reserved.
            <br />
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Result;
