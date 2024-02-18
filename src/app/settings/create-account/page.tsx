"use client";
import ButtonAppBar from "@/components/organisms/buttonAppBar";
import { Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const onClickCreateAccount = () => {
    console.log("onClickCreateAccount");
    // ダイアログを表示
    // メールに記載のリンクをクリックして認証してください。
    // メールが送付されない場合は、再送信ボタンをクリックしてください
  };

  const onClickReturn = () => {
    router.back();
  };

  return (
    <>
      <ButtonAppBar />
      <div className="bg-white">
        新規アカウント登録
        <TextField id="email" label="メールアドレス" variant="outlined" />
        <TextField
          id="email-comfirm"
          label="メールアドレス（確認）"
          variant="outlined"
        />
        <TextField id="password" label="パスワード" variant="outlined" />
        <TextField
          id="password-confirm"
          label="パスワード（確認）"
          variant="outlined"
        />
        <Button variant="outlined" onClick={onClickCreateAccount}>
          登録
        </Button>
        <Button variant="outlined" onClick={onClickReturn}>
          戻る
        </Button>
      </div>
    </>
  );
}
