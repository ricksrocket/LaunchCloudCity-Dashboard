import React, { useState, useContext } from "react";
import { servLogin } from "../services/servUsers";
import { useNavigate } from "react-router-dom";
import FlysheetContext from "../contexts/FlysheetContext";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Button } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

function LoginPage() {
  const { currentColor } = useStateContext();

  const { login } = useContext(FlysheetContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await servLogin(formData);
    if (response.success) {
      localStorage.setItem("Token", response.data.data);
      login(response.data.user);
      navigate("/dashboard");
    } else {
      console.log("Login failed:", response.message);
    }
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <p className="font-semibold text-lg dark:text-gray-200">Login</p>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="email"
          ></label>
          <TextBoxComponent
            type="text"
            name="email"
            id="email"
            value={formData.email}
            placeholder="Enter email"
            floatLabelType="Auto"
            change={(e) => handleChange("email", e.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label
            className="font-semibold text-sm dark:text-gray-200"
            htmlFor="password"
          ></label>
          <TextBoxComponent
            type="password"
            name="password"
            id="password"
            value={formData.password}
            placeholder="Enter password"
            floatLabelType="Auto"
            change={(e) => handleChange("password", e.value)}
            required
          />
        </div>

        {/* <ButtonComponent type="submit" isPrimary={true} className="mt-4">
          Login
        </ButtonComponent> */}
        <div className="mt-5" onClick={handleSubmit}>
          <Button
            color="white"
            bgColor={currentColor}
            text="Login"
            borderRadius="10px"
            width="full"
          />
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
