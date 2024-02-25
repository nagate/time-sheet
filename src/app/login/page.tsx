"use client";
// pages/login.js
import { useEffect, useState } from "react";
// import { signIn } from "next-auth/react";
import { Container, Typography, Paper, TextField, Button } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { useRouter } from "next/navigation";
import { addData, initDatabase } from "@/utils/indexedDB";

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh", // ページ全体を占めるようにする
  justifyContent: "center",
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "400px", // iPhoneサイズに合わせる
}));

const StyledForm = styled("form")({
  width: "100%",
  marginTop: "20px",
});

const StyledTextField = styled(TextField)({
  marginTop: "20px",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
});

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();

  const [credentials, setCredentials] = useState({});
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    // データベースの初期化
    initDatabase().catch((error) => {
      console.error("Error initializing database:", error);
    });
  }, [email, password]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // const result = await signIn("credentials", {
    //   redirect: false,
    //   ...credentials,
    // });

    // if (!result.error) {
    //   // ログイン成功時の処理
    //   console.log("Successfully logged in!");
    // }
  };

  const onClickCreateAccount = () => {
    console.log("onClickCreateAccount");
    if (email === "test" && password === "test") {
      // データの追加
      const newData = { email, password };
      addData(newData)
        .then((result) => {
          console.log("Data added successfully:", result);
        })
        .catch((error) => {
          console.error("Error adding data:", error);
        });
      router.push("/home");
    }
  };

  return (
    <StyledContainer maxWidth="xs">
      <StyledPaper elevation={3} theme={theme}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <StyledTextField
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={(e) =>
              // setCredentials({ ...credentials, email: e.target.value })
              setEmail(e.target.value)
            }
          />
          <StyledTextField
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={(e) =>
              // setCredentials({ ...credentials, password: e.target.value })
              setPassword(e.target.value)
            }
          />
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={onClickCreateAccount}
          >
            Login
          </StyledButton>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
}
