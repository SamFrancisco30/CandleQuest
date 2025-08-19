import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");

    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("userId", newId);

      // 插入到数据库
      supabase.from("users").insert([{ id: newId }]).then(() => {
        console.log("用户初始化完成:", newId);
      });

      setUserId(newId);
    }
  }, []);

  return userId;
}
