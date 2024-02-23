"use client";
import ButtonAppBar from "@/components/organisms/buttonAppBar";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const onClicklogin = () => {
    console.log("onClicklogin");
  };

  const onClickCreateAccount = () => {
    console.log("onClickCreateAccount");
    router.push("/settings/create-account");
  };

  return (
    <>
      <ButtonAppBar titleName="ホーム" />
      <div className="bg-white">
        <TextField id="email" label="メールアドレス" variant="outlined" />
        <TextField id="password" label="パスワード" variant="outlined" />
        <Button variant="outlined" onClick={onClicklogin}>
          ログイン
        </Button>
        <Button variant="outlined" onClick={onClickCreateAccount}>
          新規登録
        </Button>
      </div>
    </>
  );
}
