import { useCallback, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { SocialButton } from "@/components/SocialButton";
import { AuthHeader } from "@/components/AuthHeader";
import { useAuth } from "@/context/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { CancelledAuthError } from "@/lib/authFlow";


type Errors = {
  name?: string;
  email?: string;
  password?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(name: string, email: string, password: string): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Required";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!email.trim()) errors.email = "Required";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email";
  if (!password) errors.password = "Required";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters";
  return errors;
}

export default function SignUp() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const { signUp, signIn, sendOtp } = useAuth();
  const { signInWithGoogle } = useAuth();

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length > 0;

  const clearError = (key: keyof Errors) => {
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };


  
const submit = useCallback(async () => {
  if (submitting) return;

  Keyboard.dismiss();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  const found = validate(normalizedName, normalizedEmail, password);
  setErrors(found);

  if (Object.keys(found).length > 0) return;

  if (!isSupabaseConfigured) {
    setErrors({
      email: "Authentication is not configured. Please try again later.",
    });
    return;
  }

  setSubmitting(true);

  try {
    // Create a real Supabase account.
    await signUp({
      email: normalizedEmail,
      password,
      name: normalizedName,
    });

    // Supabase sends the confirmation email when email
    // confirmation is enabled in your project settings.
    // or direct link
    router.push({
      pathname: "/otp",
      params: {
        email: normalizedEmail,
        flow: "signup",
        name: normalizedName,
      },
    });
  } catch (error) {
    setErrors((previous) => ({
      ...previous,
      email:
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
    }));
  } finally {
    setSubmitting(false);
  }
}, [
  submitting,
  email,
  name,
  password,
  signUp,
]);



 


const social = useCallback(
  
  async (provider: "google" | "apple") => {
    if (provider === "apple") {
      setErrors({
        email: "Apple sign-in is not configured yet.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await signInWithGoogle();

      // signInWithGoogle completes the Supabase OAuth session.
      router.replace("/home");
    } catch (error) {
      if (error instanceof CancelledAuthError) {
      
        return;
      }

      setErrors({
        email:
          error instanceof Error
            ? error.message
            : "Google sign-in failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  },
  [signInWithGoogle],
);


  return (
    <Screen paddingBottom testID="signup-screen">
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
          <AuthHeader title="Create Account" subtitle="Join the RepUp community" />

          <View className="self-center w-full gap-4 max-w-content">
            <TextField
              label="Full Name"
              icon="person-outline"
              placeholder="Sakib Fakir"
              autoCapitalize="words"
              textContentType="name"
              value={name}
              onChangeText={(v) => {
                setName(v);
                clearError("name");
              }}
              error={errors.name}
              containerTestID="signup-name"
            />
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
                clearError("email");
              }}
              error={errors.email}
              containerTestID="signup-email"
            />
            <TextField
              label="Password"
              icon="lock-closed-outline"
              placeholder="Min. 8 characters"
              secure
              autoCapitalize="none"
              textContentType="newPassword"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                clearError("password");
              }}
              error={errors.password}
              containerTestID="signup-password"
            />

            <Button
              label="Sign Up"
              onPress={submit}
              disabled={!canSubmit}
              loading={submitting}
              testID="signup-submit"
            />

            <View className="flex-row items-center gap-3">
              <View className="flex-1 h-px bg-line" />
              <Text className="font-semibold text-caption text-content-muted">or</Text>
              <View className="flex-1 h-px bg-line" />
            </View>

            <View className="gap-3">
              <SocialButton provider="google" onPress={() => social("google")} testID="signup-google" />
              <SocialButton provider="apple" onPress={() => social("apple")} testID="signup-apple" />
            </View>
          </View>
        </ScrollView>

        <View className="items-center py-4">
          <Text className="font-semibold text-caption text-content-muted">
            Already have an account?{" "}
            <Text
              className="font-bold text-primary"
              onPress={() => router.replace("/login")}
              accessibilityRole="link"
            >
              Log In
            </Text>

          </Text>

        </View>


      </KeyboardAvoidingView>
    </Screen>
  );
}
