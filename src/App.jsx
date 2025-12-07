import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";

const ZOHO = window.ZOHO;

function App() {
  const [initialized, setInitialized] = useState(false);
  const [entity, setEntity] = useState(null);
  const [entityId, setEntityId] = useState(null);
  const [variable, setVariable] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      ZOHO.CRM.UI.Resize({ height: "400", width: "500" });
      setInitialized(true);
      if (data?.ButtonPosition === "DetailView") {
        setEntity(data?.Entity);
        setEntityId(data?.EntityId?.[0]);
      } else {
        setEntity(data?.Entity);
        setEntityId(data?.EntityId);
      }
    });

    ZOHO.embeddedApp.init();
  }, []);

  useEffect(() => {
    if (initialized) {
      const fetchData = async () => {
        const variableData = await ZOHO.CRM.API.getOrgVariable(
          "URL_Public_Image_Folder"
        );
        setVariable(variableData?.Success?.Content);
      };

      fetchData();
    }
  }, [initialized]);

  const handleSubmit = async () => {
    setLoading(true);
    var func_name = "change_variable_url";
    var req_data = {
      arguments: JSON.stringify({
        variable: variable,
      }),
    };
    const functionResp = await ZOHO.CRM.FUNCTIONS.execute(func_name, req_data);
    if (functionResp?.details?.output === "success") {
      ZOHO.CRM.UI.Popup.closeReload();
    }
  };

  if (variable) {
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ width: "90%", mx: "auto", mt: 2, mb: 2 }}>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            URL Editor
          </Typography>

          <Typography
            sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
            color="error"
          >
            *** Please remember that, editing the url will update all the
            records with the new edited URL.
          </Typography>

          <TextField
            label="URL Public Image Folder"
            fullWidth
            defaultValue={variable}
            onChange={(e) => setVariable(e.target.value)}
            placeholder="Enter the new URL here..."
            variant="outlined"
            sx={{ mt: 3 }}
          />

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => ZOHO.CRM.UI.Popup.close()}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  } else {
    //
  }
}

export default App;
