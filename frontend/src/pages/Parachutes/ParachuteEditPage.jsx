import React from "react";
import { useNavigate } from "react-router-dom";
import { createParachute } from "../../services/servParachutes";
import { Formik, Form, Field } from "formik"; // Import Formik components
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons"; // Import Syncfusion button component
import { useStateContext } from "../../contexts/ContextProvider";

export default function ParachuteAddPage() {
  const navigate = useNavigate();
  const { currentColor, currentMode } = useStateContext(); // Get theme-related context data

  const initialValues = {
    shape: "",
    area: 0,
    reefed: false,
    spillHole: false,
  };

  const handleSubmit = (values) => {
    createParachute(values).then((response) => {
      if (response.success) {
        navigate("/parachutes");
      }
    });
  };

  return (
    <div>
      <h2>Add a Parachute</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <div>
            <Field
              as={TextBoxComponent}
              label="Shape"
              name="shape"
              floatLabelType="Auto"
              cssClass={currentMode === "Dark" ? "e-dark" : ""}
            />
          </div>
          <div>
            <Field
              as={TextBoxComponent}
              label="Area"
              name="area"
              type="number"
              floatLabelType="Auto"
              cssClass={currentMode === "Dark" ? "e-dark" : ""}
            />
          </div>
          <div>
            <Field
              as={CheckBoxComponent}
              label="Reefed"
              name="reefed"
              cssClass={currentMode === "Dark" ? "e-dark" : ""}
            />
          </div>
          <div>
            <Field
              as={CheckBoxComponent}
              label="Spill Hole"
              name="spillHole"
              cssClass={currentMode === "Dark" ? "e-dark" : ""}
            />
          </div>
          <div>
            <ButtonComponent variant="primary" type="submit">
              Add Parachute
            </ButtonComponent>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
