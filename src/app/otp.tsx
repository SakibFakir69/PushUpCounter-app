import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { OtpInput } from "@/components/OtpInput";
import { AuthHeader } from "@/components/AuthHeader";
import { canResend, resendCooldownRemainingMs, sendVerificationCode, verifyCode, DEMO_OTP } from "@/lib/authFlow";
import { useAuth } from "@/context/auth";

type OtpParams = {
  email?: string;
  flow?: string;
  name?: string;
  password?: string;
};

export default function OtpScreen() {
  const params = useLocalSearchParams<OtpParams>();
  const email = params.email ?? "";
  const flow = params.flow ?? "forgot";
  const name = params.name;
  const { signIn } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(() => Math.ceil(resendCooldownRemainingMs() / 1000));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canSubmit = code.length === 6;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (canResend()) {
        setCooldown(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
      } else {
        setCooldown(Math.ceil(resendCooldownRemainingMs() / 1000));
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const submit = useCallback(async () => {
    Keyboard.dismiss();
    setVerifying(true);
    try {
      const ok = await verifyCode(code);
      if (!ok) {
        setError("Invalid code. Try again.");
        return;
      }
      setError(undefined);
      if (flow === "forgot") {
        router.push({ pathname: "/reset-password", params: { email } });
      } else if (flow === "signup") {
        // Email verified — create the local session and enter the app.
        await signIn({
          identifier: email,
          name: name || undefined,
          provider: "local",
        });
        router.replace("/home");
      } else {
        router.replace("/home");
      }
    } finally {
      setVerifying(false);
    }
  }, [code, email, flow, name, signIn]);

  const resend = useCallback(async () => {
    if (cooldown > 0) return;
    await sendVerificationCode(email);
    setCooldown(Math.ceil(resendCooldownRemainingMs() / 1000));
  }, [cooldown, email]);

  return (
    <Screen paddingBottom testID="otp-screen">
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
            title="Enter Verification Code"
            subtitle={`We sent a 6-digit code to ${email || "your email"}`}
          />

          <View className="w-full max-w-content self-center gap-6">
            <OtpInput value={code} onChange={(v) => { setCode(v); if (error) setError(undefined); }} error={error} testID="otp-input" />

            <Button
              label="Verify"
              onPress={submit}
              disabled={!canSubmit}
              loading={verifying}
              testID="otp-submit"
            />

            <View className="items-center">
              <Pressable
                onPress={resend}
                disabled={cooldown > 0}
                accessibilityRole="button"
                accessibilityLabel={cooldown > 0 ? `Resend available in ${cooldown} seconds` : "Resend code"}
                className="min-h-11 justify-center px-2"
              >
                <Text className={cooldown > 0 ? "font-semibold text-caption text-content-muted" : "font-bold text-caption text-primary"}>
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </Text>
              </Pressable>

              <View className="mt-4 rounded-card border border-line bg-surface px-4 py-3">
                <Text className="text-center font-semibold text-caption text-content-muted">
                  v1 demo code: <Text className="text-primary">{DEMO_OTP}</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
