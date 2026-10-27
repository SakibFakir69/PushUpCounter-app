import { useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { AuthHeader } from "@/components/AuthHeader";
import { resetPassword } from "@/lib/authFlow";

type Errors = {
  password?: string;
  confirm?: string;
};

export default function ResetPassword() {
  const { email = "" } = useLocalSearchParams<{ email?: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = password.length > 0 && confirm.length > 0;

  const clear = (key: keyof Errors) => {
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const submit = useCallback(async () => {
    Keyboard.dismiss();
    const found: Errors = {};
    if (!password) found.password = "Required";
    else if (password.length < 8) found.password = "Password must be at least 8 characters";
    if (!confirm) found.confirm = "Required";
    else if (confirm !== password) found.confirm = "Passwords do not match";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await resetPassword(email, password);
      router.replace("/login");
    } finally {
      setSubmitting(false);
    }
  }, [password, confirm, email]);

  return (
    <Screen paddingBottom testID="reset-password-screen">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="New Password"
            subtitle="Choose a strong password you haven’t used before"
          />

          <View className="w-full max-w-content self-center gap-4">
            <TextField
              label="New Password"
              icon="lock-closed-outline"
              placeholder="Min. 8 characters"
              secure
              autoCapitalize="none"
              textContentType="newPassword"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                clear("password");
              }}
              error={errors.password}
              containerTestID="reset-password"
            />
            <TextField
              label="Confirm Password"
              icon="lock-closed-outline"
              placeholder="Re-enter password"
              secure
              autoCapitalize="none"
              textContentType="newPassword"
              value={confirm}
              onChangeText={(v) => {
                setConfirm(v);
                clear("confirm");
              }}
              error={errors.confirm}
              containerTestID="reset-confirm"
            />

            <Button
              label="Reset Password"
              onPress={submit}
              disabled={!canSubmit}
              loading={submitting}
              testID="reset-submit"
            />

            <Button label="Back to Log In" variant="ghost" onPress={() => router.replace("/login")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
