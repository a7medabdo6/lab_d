import React, { useState, useEffect } from "react";
import axios from "../../axios";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import TopHeader from "../../components/TopHeader";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer";
import Sidebar from "../../components/sidebar";
import imgsrc from "../../assets/img/cover.png";
import imgticket from "../../assets/img/ticket.png";
import imgticket2 from "../../assets/img/ticket2.jpg";

import Form from "../../components/Form";
import Modal from "../../components/Modal";
import "react-datepicker/dist/react-datepicker.css";
import Table from "react-bootstrap/Table";
import usersrc from "../../assets/img/user.jpg";
import { useHistory } from "react-router-dom";
import domtoimage from "dom-to-image-more";
import { ProgressBar } from "react-bootstrap";
const ref = React.createRef();

function Dashboard({ uncompleted }) {
  const [value, onChange] = useState(null);
  const [valueOfReportDate, setonChangeReportDate] = useState(null);
  const [userImage, setUserImage] = useState(null);

  const [username_ar, setusername_ar] = useState("");
  const [username_en, setusername_en] = useState("");
  const [birth, setbirth] = useState("");
  const [years, setyears] = useState("");

  const [gender, setgender] = useState("male");
  const [passport_Number, setpassport_Number] = useState("");
  const [passport_expiry, setpassport_expiry] = useState("");
  const [IssueCode, setIssueCode] = useState("");
  const [ApprovedCode, setApprovedCode] = useState("");

  const [identity_Number, setidentity_Number] = useState("");
  const [nation, setnation] = useState("");
  const [location, setlocation] = useState("");
  const [customer_id, setcustomer_id] = useState("");
  const [password, setpassword] = useState("");

  const [test, settest] = useState("PCR testing for SARS-CoV2");
  const [result, setresult] = useState("Negative");
  const [modalShow, setModalShow] = useState(false);

  const [collectDate, setcollectDate] = useState("");
  const [reportDate, setreportDate] = useState("");
  const [unit, setunit] = useState("N/L");
  const [branch, setbranch] = useState("");
  const [border, setborder] = useState("Negative");
  const [refDoctor, setrefDoctor] = useState("himself");
  const [customer_report, setcustomer_report] = useState(null);
  const [customer_image, setcustomer_image] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [Ticket, setTicket] = useState(true);
  const [background, setbackground] = useState(true);
  const [DisplayComment, setDisplayComment] = useState(true);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [collecteAtString, setcollecteAtString] = useState("");

  const [qrsrc, setqrsrc] = useState(
    `https://qr.speedlab-resaults.com/#/customer/result?customer_id=${customer_id}&random=qrsrcqrsrqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrccqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrcqrsrc`
  );
  const onChangeCollectDate = (date) => {
    var options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    onChange(date);
    console.log(JSON.stringify(date), date, "dateee");
    var h = new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    var d = new Date(date).toLocaleDateString("en-GB");
    console.log(`${d} ${h}`);
    setcollectDate(`${d} ${h}`);
    console.log(date, "collecteAtString");
    setcollecteAtString(`${date.toLocaleString("en-ZA", options)} ${h}`);
  };
  const router = useHistory();

  const onChangeReportDate = (date) => {
    setonChangeReportDate(date);
    console.log(JSON.stringify(date), "dateee");
    var h = new Date(date).toLocaleTimeString("en-US");
    var d = new Date(date).toLocaleDateString("en-GB");
    console.log(`${d} ${h}`);
    setreportDate(`${d} ${h}`);
  };
  useEffect(() => {
    var localStorageObj = localStorage.getItem("user");
    var parsed = JSON.parse(localStorageObj);
    if (
      parsed?.role !== "superAdmin" &&
      parsed?.role !== "leader" &&
      parsed?.role !== "employer"
    ) {
      return router.push("/login");
    }
  }, []);
  const psotCustomer = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("customer_image", customer_image);
    formData.append("customer_report", customer_report);
    formData.append("username_ar", username_ar);
    formData.append("username_en", username_en);
    formData.append("birth", birth);
    formData.append("years", years);

    formData.append("gender", gender);
    formData.append("passport_Number", passport_Number);
    formData.append("passport_expiry", passport_expiry);
    formData.append("IssueCode", IssueCode);
    formData.append("ApprovedCode", ApprovedCode);

    formData.append("identity_Number", identity_Number);
    formData.append("nation", nation);
    formData.append("location", location);
    formData.append("customer_id", customer_id);
    formData.append("password", password);

    formData.append("test", test);
    formData.append("result", result);
    formData.append("collectDate", collectDate);
    formData.append("reportDate", reportDate);
    formData.append("unit", unit);
    formData.append("branch", branch);
    formData.append("border", border);
    formData.append("refDoctor", refDoctor);

    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        if (percent < 100) {
          setUploadPercentage(percent);
        }
        if (percent == 100) {
        }
      },
      headers: { "content-type": "multipart/form-data" },
    };
    console.log(customer_image, "customer_image");

    axios
      .post("customer/post", formData, options)
      .then((result) => {
        console.log(result, "resultresult");
        setUploadPercentage(100);
        console.log(result, "result");
        setSuccess(result.status == 200 ? true : false);
        setErrors([]);
        setModalShow(true);
        var oldlocalStorageObj = localStorage.getItem("user");
        var oldparsed = JSON.parse(oldlocalStorageObj);
        var newparsed = oldparsed;
        newparsed.customer += 1;
        console.log(newparsed, "newparsed");
        localStorage.setItem("user", JSON.stringify(newparsed));
      })
      .catch((error) => {
        setUploadPercentage(0);

        setErrors(error.response.data.errors);
        console.log(error.response);
      });
  };

  useEffect(() => {
    setqrsrc(
      `https://qr.speedlab-resaults.com/#/customer/result?customer_id=${customer_id}&random=setqrsrcssrcsetqrsr&random2=csetqrsrcsetqrsrc&random5=csetqrsrcsetqrsrc&random6=csetqrsrcsetqrsrc&random7=csetqrsrcsetqrsrc&random8=csetqrsrcsetqrsrc`
    );
  }, [customer_id]);
  const generate = () => {
    const options = {
      scale: 1,
      allowTaint: false,
      logging: true,
      useCORS: true,
    };
    html2canvas(document.querySelector("#cpdf"), options).then((canvas) => {
      // document.body.appendChild(canvas);
      const pdf = new jsPDF("p", "pt", "a4", true);
      console.log(canvas.width, "canvas.width ");
      var imgWidth = pdf.internal.pageSize.getWidth();
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpg");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, "", "FAST");
      pdf.save(`${username_ar}.pdf`);
    });
  };
  const DisplayTicket = () => {
    setTicket(!Ticket);
  };
  const DisplayBack = () => {
    setbackground(!background);
  };
  const Displaycomment = () => {
    setDisplayComment(false);
  };
  const ShowComment = () => {
    setDisplayComment(true);
  };

  /*
 
  */
  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setUserImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const typeOfComment = () => {
    if (test == "Covid-19 Ag") {
      return (
        <div
          _ngcontent-edh-c48=""
          id="comment"
          style={{
            display: DisplayComment ? "" : "none",
          }}
          class="row"
        >
          <div _ngcontent-edh-c48="" class="col-2">
            <h4 _ngcontent-edh-c48="" class="fw-bold">
              Comment:{" "}
            </h4>
          </div>
          <div
            _ngcontent-edh-c48=""
            class="col-10"
            style={{ marginLeft: "51px" }}
          >
            <h5 _ngcontent-edh-c48="">
              <br />
              1-The result may be affected by sampling time, sampling location
              and methodological limitations, and the result should be Analyzed
              in combination with the clinical data.
              <br /> <br />
              2-This report is only responsible for the samples sent to be
              tested.
              <br /> <br />
              3-The negative result from a single test of Nuclic Acid Detection
              of COVID-19 should not rule the possibility of infection
              <br />
            </h5>{" "}
          </div>
        </div>
      );
    } else if (test == "IgM Detection of COVID-19") {
      return (
        <div
          _ngcontent-edh-c48=""
          id="comment"
          style={{
            display: DisplayComment ? "" : "none",
          }}
          class="row"
        >
          <div _ngcontent-edh-c48="" class="col-2">
            <h4 _ngcontent-edh-c48="" class="fw-bold">
              Comment:{" "}
            </h4>
          </div>
          <div
            _ngcontent-edh-c48=""
            class="col-10"
            style={{ marginLeft: "50px" }}
          >
            <h5 _ngcontent-edh-c48="">
              <br />
              1-The result may be affected by sampling time, sampling location
              and methodological limitations, and the result should be Analyzed
              in combination with the clinical data.
              <br /> <br />
              2-This report is only responsible for the samples sent to be
              tested.
              <br /> <br />
              3-The negative result from a single test of Nuclic Acid Detection
              of COVID-19 should not rule the possibility of infection
              <br />
            </h5>{" "}
          </div>
        </div>
      );
    }
    return (
      <div
        _ngcontent-edh-c48=""
        id="comment"
        style={{
          display: DisplayComment ? "" : "none",
        }}
        class="row"
      >
        <div _ngcontent-edh-c48="" class="col-2">
          <h4 _ngcontent-edh-c48="" class="fw-bold">
            Comment:{" "}
          </h4>
        </div>
        <div
          _ngcontent-edh-c48=""
          class="col-10"
          style={{ marginLeft: "50px" }}
        >
          <h5 _ngcontent-edh-c48="">
            <br />
            1-The result may be affected by sampling time, sampling location and
            methodological limitations, and the result should be Analyzed in
            combination with the clinical data.
            <br /> <br />
            2-This report is only responsible for the samples sent to be tested.
            <br /> <br />
            3-The negative result from a single test of Nuclic Acid Detection of
            COVID-19 should not rule the possibility of infection
            <br />
          </h5>{" "}
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="">
        <MainHeader active="dashboard" />
        <div _ngcontent-rgj-c41="" class="d-flex minhight">
          <Sidebar active="customers" />
          <section
            _ngcontent-edh-c48=""
            style={{ width: "85%" }}
            class="px-4 py-5"
          >
            <div _ngcontent-edh-c48="" class="w-100">
              <div _ngcontent-edh-c48="" class="row justify-content-center">
                <form
                  _ngcontent-edh-c48=""
                  novalidate=""
                  class="bg-white p-5 corner-30 shadow-sm col-md-6 text-center ng-invalid ng-dirty ng-touched"
                >
                  <h2
                    _ngcontent-edh-c48=""
                    class="text-center fw-bold pb-4 color-main"
                  >
                    اضافة عميل جديد
                  </h2>
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname="name"
                    value={username_ar}
                    onChange={(e) => setusername_ar(e.target.value)}
                    placeholder="اسم العميل"
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "username_ar")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  {
                    <input
                      _ngcontent-edh-c48=""
                      type="text"
                      formcontrolname="name_en"
                      value={username_en}
                      onChange={(e) => setusername_en(e.target.value)}
                      placeholder="اسم العميل انجليزي"
                      class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                        errors?.find((x) => x.param === "username_en")
                          ? "is-invalid"
                          : "valid"
                      }`}
                    />
                  }
                  <h6 _ngcontent-edh-c48="" class="text-center">
                    النوع
                  </h6>
                  <select
                    value={gender}
                    _ngcontent-edh-c48=""
                    onChange={(e) => setgender(e.target.value)}
                    formcontrolname="gender"
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "gender")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  >
                    <option value="male" _ngcontent-edh-c48="" value="male">
                      ذكر
                    </option>
                    <option value="female" _ngcontent-edh-c48="" value="female">
                      انثى
                    </option>
                  </select>
                  <input
                    _ngcontent-edh-c48=""
                    type="date"
                    onfocus="(this.type='date')"
                    placeholder="تاريخ الميلاد"
                    formcontrolname="date_of_birth"
                    value={birth}
                    onChange={(e) => setbirth(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "birth")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  {/*
                  <input
                    _ngcontent-edh-c48=""
                    onfocus="(this.type='date')"
                    placeholder=" العمر"
                    formcontrolname=""
                    value={years}
                    required
                    onChange={(e) => setyears(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "birth")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  */}
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname="identity"
                    placeholder="رقم الباسبور"
                    value={passport_Number}
                    onChange={(e) => setpassport_Number(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "passport_Number")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <h6>تاريخ انتهاء جواز السفر</h6>
                  <input
                    _ngcontent-edh-c48=""
                    type="date"
                    placeholder="تاريخ انتهاء جواز السفر"
                    value={passport_expiry}
                    onChange={(e) => setpassport_expiry(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "passport_expiry")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname="national_id"
                    placeholder="الرقم القومي"
                    value={identity_Number}
                    onChange={(e) => setidentity_Number(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "identity_Number")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname=""
                    placeholder="Issue Code"
                    value={IssueCode}
                    onChange={(e) => setIssueCode(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "IssueCode")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname=""
                    placeholder="Approved Code"
                    value={ApprovedCode}
                    onChange={(e) => setApprovedCode(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "ApprovedCode")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname="location"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setlocation(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "location")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  {
                    <input
                      _ngcontent-edh-c48=""
                      type="text"
                      formcontrolname="nationality"
                      placeholder="الجنسية"
                      value={nation}
                      onChange={(e) => setnation(e.target.value)}
                      class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                        errors?.find((x) => x.param === "nation")
                          ? "is-invalid"
                          : "valid"
                      }`}
                    />
                  }
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname="patient_id"
                    placeholder="العميل ID"
                    value={customer_id}
                    onChange={(e) => setcustomer_id(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "customer_id")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname="password"
                    placeholder="كلمه المرور"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "password")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <h6 _ngcontent-edh-c48="" class="text-center">
                    التحليل
                  </h6>
                  <input
                    _ngcontent-edh-c48=""
                    formcontrolname="test"
                    value={test}
                    disabled
                    formcontrolname="gender"
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "test")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <h6 _ngcontent-edh-c48="" class="text-center">
                    النتيجة
                  </h6>
                  <select
                    _ngcontent-edh-c48=""
                    formcontrolname="result"
                    value={result}
                    onChange={(e) => setresult(e.target.value)}
                    formcontrolname="gender"
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "result")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  >
                    <option _ngcontent-edh-c48="" selected="">
                      النتيجة
                    </option>
                    <option _ngcontent-edh-c48="" value="Negative">
                      Negative
                    </option>
                    <option _ngcontent-edh-c48="" value="Positive">
                      Positive
                    </option>
                  </select>
                  <span
                    class={` spanfordate form-control text-center border-main-2  corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "collectDate")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  >
                    <DatePicker
                      selected={value}
                      placeholderText="Collect date"
                      onChange={(date) => onChangeCollectDate(date)}
                      showTimeSelect
                      dateFormat="dd/MM/yyyy  EE hh:mm a"
                    />
                  </span>
                  <span
                    class={` spanfordate form-control text-center border-main-2 my-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "reportDate")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  >
                    <DatePicker
                      selected={valueOfReportDate}
                      placeholderText="report date"
                      onChange={(date) => {
                        onChangeReportDate(date);
                      }}
                      showTimeSelect
                      dateFormat="dd/MM/yyyy  EE hh:mm a"
                    />
                  </span>
                  {/*<h6 _ngcontent-edh-c48="" class="text-center">
                    Unit
                  </h6>{" "}
                  <select
                    _ngcontent-edh-c48=""
                    formcontrolname="unit"
                    value={unit}
                    onChange={(e) => setunit(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "unit")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  >
                    <option _ngcontent-edh-c48="" value="">
                      بدون
                    </option>
                    <option _ngcontent-edh-c48="" value="N/A">
                      N/A
                    </option>
                    <option _ngcontent-edh-c48="" value="N/L">
                      N/L
                    </option>
                    <option _ngcontent-edh-c48="" value="IU/Ml">
                      IU/Ml
                    </option>
                  </select>
                  */}
                  {/* 
                
                  
                  <input
                    _ngcontent-edh-c48=""
                    type="text"
                    formcontrolname="branch"
                    placeholder="الفرع"
                    value={branch}
                    onChange={(e) => setbranch(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "branch")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  */}
                  {/*
                  <h6 _ngcontent-edh-c48="" class="text-center">
                    النطاق المرجعي
                  </h6>
                  <select
                    _ngcontent-edh-c48=""
                    formcontrolname="reference_range"
                    value={border}
                    onChange={(e) => setborder(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "border")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  >
                    <option _ngcontent-edh-c48="" value="Negative">
                      Negative
                    </option>
                    <option _ngcontent-edh-c48="" value="Positive">
                      Positive
                    </option>
                  </select>
                  */}
                  {/*  <h6 _ngcontent-edh-c48="" class="text-center">
                    Ref. Doctor
                  </h6>
                  <select
                    _ngcontent-edh-c48=""
                    formcontrolname="lab_director"
                    value={refDoctor}
                    onChange={(e) => setrefDoctor(e.target.value)}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "refDoctor")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  >
                    <option _ngcontent-edh-c48="" value="himself">
                      Himself
                    </option>
                    <option _ngcontent-edh-c48="" value="herself">
                      Herself
                    </option>
                  </select>
                  */}
                  <h5
                    _ngcontent-edh-c48=""
                    class="text-muted text-end py-3 "
                    style={{ marginRight: "50px" }}
                  >
                    تقرير العميل
                  </h5>
                  <input
                    _ngcontent-edh-c48=""
                    type="file"
                    id="formFile"
                    class="form-control"
                    name="customer_report"
                    //value={customer_report}
                    onChange={(e) => {
                      setcustomer_report(e.target.files[0]);
                    }}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "customer_report")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <ProgressBar
                    now={uploadPercentage}
                    striped={true}
                    label={`${uploadPercentage}%`}
                  />
                  <h5 _ngcontent-edh-c48="" class="text-muted text-end py-3">
                    صورة العميل
                  </h5>
                  <input
                    _ngcontent-edh-c48=""
                    type="file"
                    id="formFile"
                    name="customer_image"
                    /* value={customer_image}*/
                    onChange={(e) => {
                      imageHandler(e);
                      setcustomer_image(e.target.files[0]);
                    }}
                    class={`form-control text-center border-main-2 my-3 p-3 corner-5 ng-valid ng-dirty ng-touched ${
                      errors?.find((x) => x.param === "customer_image")
                        ? "is-invalid"
                        : "valid"
                    }`}
                  />
                  <div
                    _ngcontent-edh-c48=""
                    class="w-100 py-4"
                    onClick={DisplayTicket}
                  >
                    <a _ngcontent-edh-c48="" class="btn btn-warning">
                      اظهار / اخفاء الختم
                    </a>
                  </div>
                  {/* <div
                    _ngcontent-edh-c48=""
                    class="w-100 py-4"
                    onClick={DisplayBack}
                  >
                    <a _ngcontent-edh-c48="" class="btn btn-warning">
                      اظهار / اخفاء خلفية التقرير
                    </a>
                  </div>
                  <div _ngcontent-edh-c48="" class="w-100 py-4">
                    <a
                      _ngcontent-edh-c48=""
                      class="btn btn-warning"
                      onClick={Displaycomment}
                    >
                      اخفاء الكومنت
                    </a>
                    <a
                      _ngcontent-edh-c48=""
                      class="btn btn-success"
                      onClick={ShowComment}
                    >
                      اظهار الكومنت
                    </a>
                  </div>
                                    */}

                  <input
                    _ngcontent-edh-c48=""
                    type="submit"
                    onClick={(e) => psotCustomer(e)}
                    value="اضافة"
                    class="btn bg-main color-light font-20 mt-4 bg-main-hover"
                  />
                </form>

                <Modal
                  show={modalShow}
                  onHide={() => {
                    router.push("/dashboard");

                    setModalShow(false);
                  }}
                  message="تم اضافه التحليل بنجاح"
                />
              </div>
            </div>
            <div
              id=""
              _ngcontent-edh-c48=""
              class="w-100 d-flex justify-content-center"
            >
              <div
                _ngcontent-edh-c48=""
                dir="ltr"
                class="report-preview  col-md-6 w-100"
              >
                <div
                  _ngcontent-edh-c48=""
                  id="cpdf"
                  ref={ref}
                  class="report  d-flex flex-column letter-head"
                  style={{
                    backgroundSize: "cover",

                    backgroundImage: `${
                      background ? `url(${imgsrc})` : "none"
                    }`,
                  }}
                >
                  <div
                    className="m-3 cpdf-border"
                    style={{
                      height: "1287px",
                    }}
                  >
                    <div className="divforqr mt-3">
                      <div style={{ margin: "0px 181px 0px 0px" }}>
                        <h5 style={{ textAlign: "center", color: "#000055" }}>
                          Medical Laboratory Report <br /> Drive Thru Collection
                          Site
                          <br />
                          <span
                            style={{ fontFamily: "Arialn", fontWeight: "600" }}
                          >
                            تقرير معملي طبي
                            <br />
                            خدمة جمع عينات درايف ثرو
                          </span>
                        </h5>
                      </div>
                      <div
                        _ngcontent-edh-c48=""
                        class="mr-2 d-flex justify-content-center align-items-center"
                      >
                        <qrcode _ngcontent-edh-c48="">
                          <div class="qrcode">
                            <QRCode value={qrsrc} />,
                          </div>
                        </qrcode>
                      </div>
                    </div>
                    <table class="table">
                      <tbody>
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",

                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row"
                                style={{ margin: "5px 10px 5px 5px" }}
                              >
                                Name
                              </th>
                              <td style={{ margin: "5px 10px 5px 5px" }}>
                                {username_en}
                              </td>
                            </div>
                            <div className="col-4"></div>
                            <div
                              className="col-4 arabicFont"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <td> {username_ar}</td>
                              <th
                                scope="row"
                                style={{ margin: "5px 0px 5px 10px" }}
                              >
                                الاسم
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",

                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row"
                                style={{ margin: "5px 10px 5px 5px" }}
                              >
                                Nationality
                              </th>
                              <td>{nation}</td>
                            </div>
                            <div className="col-4"></div>
                            <div
                              className="col-4 arabicFont"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <td>{nation}</td>
                              <th
                                scope="row"
                                style={{ margin: "5px 0px 5px 10px" }}
                              >
                                الجنسية
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",
                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row"
                                style={{ margin: "5px 10px 5px 5px" }}
                              >
                                passport Number
                              </th>
                              <td>{passport_Number}</td>
                            </div>
                            <div className="col-4"></div>
                            <div
                              className="col-4 arabicFont"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <td>{passport_Number}</td>
                              <th
                                scope="row"
                                style={{ margin: "5px 0px 5px 10px" }}
                              >
                                رقم جواز السفر
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",

                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row"
                                style={{ margin: "5px 10px 5px 5px" }}
                              >
                                Passport Expiry
                              </th>
                              <td>{passport_expiry}</td>
                            </div>
                            <div className="col-4"></div>
                            <div
                              className="col-4 arabicFont"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <td>{passport_expiry}</td>
                              <th
                                scope="row"
                                style={{ margin: "5px 0px 5px 10px" }}
                              >
                                جواز سفر ساري حتي
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",
                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row"
                                style={{ margin: "5px 10px 5px 5px" }}
                              >
                                Date of Birth
                              </th>
                              <td>{birth}</td>
                            </div>
                            <div className="col-4"></div>
                            <div
                              className="col-4 arabicFont"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <td>{birth}</td>
                              <th
                                scope="row"
                                style={{ margin: "5px 0px 5px 10px" }}
                              >
                                تاريخ الميلاد
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",
                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row"
                                style={{ margin: "5px 10px 5px 5px" }}
                              >
                                Sample Collected at
                              </th>
                              <td>{location}</td>
                            </div>
                            <div className="col-4"></div>
                            <div
                              className="col-4 arabicFont"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <td>{location}</td>
                              <th
                                scope="row"
                                style={{ margin: "5px 0px 5px 10px" }}
                              >
                                مكان سحب العينة
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                        <div className="divuserImage">
                          <img
                            className="userImage"
                            src={userImage ? userImage : usersrc}
                          />{" "}
                        </div>
                      </tbody>
                    </table>

                    <table class="table table2">
                      <tbody>
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-6"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <th scope="row " style={{ padding: " 51px" }}>
                                This is to certify the aforementioned person has
                                undergone testing for COVID-19 disease by the
                                below referred laboratory utilizing the highest
                                sensitive molecular technique RT-PCR.
                                Nasopharyngeal sample was collected according to
                                WHO guidelines and infection control standards.
                                RNA extraction, reverse transcription to
                                complementary DNA subjected for testing to
                                confirm the presence of the know gene sequence
                                of SARS-COV-2 virus in the designated sample.
                              </th>
                            </div>
                            <div
                              className="col-6 "
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row arabicFont"
                                style={{
                                  padding: "18px",
                                  textAlign: "right",
                                  direction: "rtl",
                                }}
                              >
                                المذكور أعلاه قد خضع لاختبار كورونا المستجد فى
                                الوحدة المعملية المشار اليها باستخدام أحدث
                                التقنيات الجزئية عالية الحساسية
                                <span style={{ paddingRight: "5px" }}>
                                  RT-PCR Real Time Polymerase Chain Reaction.
                                </span>
                                تم جمع العينة باستخدام مسحة بلعوم أنفى طبقا
                                لارشادات منظمة الصحة العالمية و معايير مكافحة
                                العدوي ويتم استخراج RNA الفيروسى منها , يتم نسخ
                                RNA المستخرج بشكل عكسي للحصول علي الحمض النووي
                                التكميلي (cDNA) و يخضع للاختبار للتأكيد من وجود
                                التسلسل الجيني المعروف الفيروس SARS-COV-2 فى
                                العينة المحدده
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-6 "
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <th scope="row " style={{ padding: "30px" }}>
                                From The clinical laboratory point of view{" "}
                                <br />
                                <span style={{ color: "#23403b" }}>
                                  PCR testing few‘ SARS-C’oV2 is {result}.
                                </span>
                              </th>
                            </div>
                            <div
                              className="col-6 "
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row arabicFont"
                                style={{
                                  padding: "30px",
                                  textAlign: "right",
                                }}
                              >
                                من وجهة نظر الفحص المختبري للعينة
                                <span
                                  style={{
                                    color: "#23403b",
                                    padding: "0px 5px",
                                  }}
                                >
                                  نتيجة اختبار فيروس
                                </span>
                                <br />
                                <span style={{ color: "#23403b" }}>
                                  كورونا المستجد
                                  <sapn style={{ padding: "0px 5px" }}>
                                    {result == "Negative" ? "سلبية" : "موجبة"}
                                  </sapn>
                                </span>
                                للمذكور اعلاه
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                      </tbody>
                    </table>
                    <p className="m-3 " style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "Arialn", fontWeight: "600" }}>
                        تم اختبار العينة بوحدة البيولوجيا الجزئية
                      </span>
                      <br />
                      <br />
                      Sample processing and testing was performed by molecular
                      biological unit
                    </p>
                    <table class="table table2">
                      <tbody>
                        <tr>
                          <div
                            className="row"
                            style={{
                              width: "1100px",
                              margin: "auto",
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "0px",
                            }}
                          >
                            <div
                              className="col-6 "
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row "
                                style={{
                                  padding: "20px 40px",
                                  width: "100%",
                                  height: "150px",
                                }}
                              >
                                <p>
                                  <span style={{ margin: "5px 10px" }}>
                                    Issue Code
                                  </span>
                                  <span style={{ margin: "5px 10px" }}>
                                    {IssueCode}
                                  </span>
                                </p>{" "}
                                <p>
                                  <span style={{ margin: "5px 10px" }}>
                                    Approval Code
                                  </span>
                                  <span style={{ margin: "5px 10px" }}>
                                    {ApprovedCode}
                                  </span>
                                </p>{" "}
                                <p>
                                  <span style={{ margin: "5px 10px" }}>
                                    Sample collected on{" "}
                                  </span>
                                  <span style={{ margin: "5px 10px" }}>
                                    {collecteAtString}
                                  </span>
                                </p>{" "}
                                .
                              </th>
                            </div>
                            <div
                              className="col-6 "
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                              }}
                            >
                              <th
                                scope="row"
                                style={{
                                  padding: "20 40px",
                                  textAlign: "right",
                                }}
                              >
                                <p className="arabicFont">
                                  <span style={{ margin: "5px 10px" }}>
                                    {IssueCode}
                                  </span>
                                  <span style={{ margin: "5px 10px" }}>
                                    كود الاصدار
                                  </span>
                                </p>{" "}
                                <p>
                                  <span style={{ margin: "5px 10px" }}>
                                    {ApprovedCode}
                                  </span>
                                  <span style={{ margin: "5px 10px" }}>
                                    كود الاعتماد
                                  </span>
                                </p>{" "}
                                <p>
                                  <span style={{ margin: "5px 10px" }}>
                                    {collecteAtString}
                                  </span>
                                  <span style={{ margin: "5px 10px" }}>
                                    تاريخ سحب العينة
                                  </span>
                                </p>{" "}
                              </th>
                            </div>
                          </div>
                        </tr>{" "}
                      </tbody>
                    </table>

                    <div _ngcontent-edh-c48="" class="px-5 mx-5"></div>
                    <div _ngcontent-edh-c48="" id="stamp-img" class=" text-end">
                      <div
                        _ngcontent-elm-c47=""
                        class="col-6 d-flex align-items-center justify-content-between"
                      >
                        <div
                          _ngcontent-elm-c47=""
                          class="row"
                          style={{ width: "100%", display: "flex" }}
                        >
                          <h6
                            _ngcontent-edh-c48=""
                            class="fst-italic  my-2 text-center mb-3"
                          >
                            <img
                              src={imgticket}
                              style={{
                                display: Ticket ? "flex" : "none",
                                justifyContent: "center",
                                alignItems: "center",

                                margin: "auto",
                              }}
                            />
                          </h6>
                          {/*   <h6
                            _ngcontent-edh-c48=""
                            class="fst-italic  my-2 text-center mb-3"
                            style={{ position: "absolute", bottom: "200px" }}
                          >
                            <img src={imgticket} style={{ width: "250px" }} />
                          </h6>
                          */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div _ngcontent-edh-c48="" class="download-btn text-center">
                  <button
                    _ngcontent-edh-c48=""
                    value="اضافة"
                    style={{ width: "180px !important" }}
                    class="btn bg-main color-light font-20 mt-4 bg-main-hover"
                    onClick={generate}
                  >
                    {" "}
                    تحميل
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/*  <Form />*/}
      </div>
    </>
  );
}

export default Dashboard;
