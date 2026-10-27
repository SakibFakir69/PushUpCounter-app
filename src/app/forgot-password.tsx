import { useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { AuthHeader } from "@/components/AuthHeader";
import { sendVerificationCode } from "@/lib/authFlow";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0;

  const submit = useCallback(async () => {
    Keyboard.dismiss();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Required");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      await sendVerificationCode(trimmed);
      router.push({ pathname: "/otp", params: { email: trimmed, flow: "forgot" } });
    } finally {
      setSubmitting(false);
    }
  }, [email]);

  return (
    <Screen paddingBottom testID="forgot-password-screen">
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
            title="Forgot Password"
            subtitle="Enter your email and we’ll send you a verification code"
          />

          <View className="w-full max-w-content self-center gap-4">
            <TextField
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (error) setError(undefined);
              }}
              error={error}
              containerTestID="forgot-email"
            />

            <Button
              label="Send Code"
              onPress={submit}
              disabled={!canSubmit}
              loading={submitting}
              testID="forgot-submit"
            />

            <Button
              label="Back to Log In"
              variant="ghost"
              onPress={() => router.replace("/login")}
              testID="forgot-back"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
