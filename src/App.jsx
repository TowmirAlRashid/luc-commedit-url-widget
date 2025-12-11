import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";

const ZOHO = window.ZOHO;

function App() {
  const [initialized, setInitialized] = useState(false);
  const [entity, setEntity] = useState(null);
  const [entityId, setEntityId] = useState(null);
  const [variable, setVariable] = useState(null);
  const [url, setUrl] = useState(null);
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
        setUrl(variableData?.Success?.Content);
      };

      fetchData();
    }
  }, [initialized]);

  const handleSubmit = async () => {
    setLoading(true);
    var recordData = {
      Modified_URL: url,
      Page_Number: 1,
      Job_Status: "Pending",
    };
    const createRecordResp = await ZOHO.CRM.API.insertRecord({
      Entity: "URL_Cronjob_Logs",
      APIData: recordData,
      Trigger: ["workflow"],
    });
    console.log(createRecordResp);
    if (createRecordResp?.data?.[0]?.code === "SUCCESS") {
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
            records with the new edited URL. and that the New URL should end
            with a "/" for example https://www.vanwijk.nl/
          </Typography>

          <TextField
            label="URL Public Image Folder"
            fullWidth
            value={url ?? ""}
            onChange={(e) => setUrl(e.target.value)}
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
