import { useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { SocialButton } from "@/components/SocialButton";
import { AuthHeader } from "@/components/AuthHeader";
import { useAuth } from "@/context/auth";

type Errors = {
  identifier?: string;
  password?: string;
};

function validate(identifier: string, password: string): Errors {
  const errors: Errors = {};
  if (!identifier.trim()) errors.identifier = "Required";
  if (!password) errors.password = "Required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

export default function Login() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = identifier.trim().length > 0 && password.length > 0;

  const submit = useCallback(async () => {
    Keyboard.dismiss();
    const found = validate(identifier, password);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      // Local-only auth in v1 — matches onboarding privacy promise (DESIGN.md §7.3).
      await signIn({ identifier: identifier.trim(), provider: "local" });
      router.replace("/home");
    } finally {
      setSubmitting(false);
    }
  }, [identifier, password, signIn]);

  const social = useCallback(
    (provider: "google" | "apple") => {
      // OAuth not wired yet (DESIGN.md §11). Sign in with a demo identity.
      void signIn({ identifier: `athlete@${provider}.demo`, provider }).then(() =>
        router.replace("/home"),
      );
    },
    [signIn],
  );

  return (
    <Screen paddingBottom testID="login-screen">
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
          <AuthHeader title="Welcome Back" subtitle="Log in to continue your journey" showBack={false} />

          <View className="w-full max-w-content self-center gap-4">
            <TextField
              label="Email or Username"
              icon="person-outline"
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              value={identifier}
              onChangeText={(v) => {
                setIdentifier(v);
                if (errors.identifier) setErrors((e) => ({ ...e, identifier: undefined }));
              }}
              error={errors.identifier}
              containerTestID="login-identifier"
            />
            <TextField
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              secure
              autoCapitalize="none"
              textContentType="password"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
              }}
              error={errors.password}
              containerTestID="login-password"
            />

            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => router.push("/forgot-password")}
              className="min-h-11 justify-center self-end"
              testID="login-forgot"
            >
              <Text className="font-semibold text-caption text-primary">Forgot password?</Text>
            </Pressable>

            <Button
              label="Log In"
              onPress={submit}
              disabled={!canSubmit}
              loading={submitting}
              testID="login-submit"
            />

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-line" />
              <Text className="font-semibold text-caption text-content-muted">or</Text>
              <View className="h-px flex-1 bg-line" />
            </View>

            <View className="gap-3">
              <SocialButton provider="google" onPress={() => social("google")} testID="login-google" />
              <SocialButton provider="apple" onPress={() => social("apple")} testID="login-apple" />
            </View>
          </View>
        </ScrollView>

        <View className="items-center py-4">
          <Text className="font-semibold text-caption text-content-muted">
            Don{"\u2019"}t have an account?{" "}
            <Text
              className="font-bold text-primary"
              onPress={() => router.push("/signup")}
              accessibilityRole="link"
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
