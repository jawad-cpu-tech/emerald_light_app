import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import { useCounter } from "@/context/CounterContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { FloatingPlusOne } from "@/components/FloatingPlusOne";
import { MilestoneModal } from "@/components/MilestoneModal";
import { GlassCard } from "@/components/GlassCard";

interface PlusOneItem {
  id: string;
  x: number;
  y: number;
}

function PulsingGlow({ color }: { color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.2);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.15, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          borderRadius: 80,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export default function CounterScreen() {
  const { count, increment, reset, formattedCount, nextMilestone, progress } = useCounter();
  const { colors, isGolden, unlockGolden } = useTheme();
  const { t, isArabic, toggleLanguage } = useLanguage();
  const insets = useSafeAreaInsets();

  const [plusOnes, setPlusOnes] = useState<PlusOneItem[]>([]);
  const [milestoneVisible, setMilestoneVisible] = useState(false);
  const [milestoneCount, setMilestoneCount] = useState<bigint>(0n);
  const [isGoldenUnlock, setIsGoldenUnlock] = useState(false);

  const buttonScale = useSharedValue(1);
  const counterScale = useSharedValue(1);
  const glowBurst = useSharedValue(0);

  const handlePress = useCallback(
    (evt: any) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      buttonScale.value = withSequence(
        withTiming(0.88, { duration: 70, easing: Easing.out(Easing.quad) }),
        withSpring(1, { damping: 6, stiffness: 260, mass: 0.7 })
      );
      counterScale.value = withSequence(
        withTiming(1.12, { duration: 90 }),
        withSpring(1, { damping: 10, stiffness: 220 })
      );
      glowBurst.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
      );

      const id = Crypto.randomUUID();
      const px = evt?.nativeEvent?.pageX ?? 200;
      const py = evt?.nativeEvent?.pageY ?? 380;
      setPlusOnes((prev) => [...prev, { id, x: px, y: py }]);

      const milestone = increment();

      if (milestone !== null) {
        const isGolden1000 = milestone === 1000n;
        if (isGolden1000 && !isGolden) {
          unlockGolden();
          setIsGoldenUnlock(true);
        } else {
          setIsGoldenUnlock(false);
        }
        setMilestoneCount(milestone);
        setTimeout(() => setMilestoneVisible(true), 350);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    },
    [count, isGolden]
  );

  const removePlusOne = useCallback((id: string) => {
    setPlusOnes((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const confirmReset = () => {
    Alert.alert(t.reset, t.resetConfirm, [
      { text: t.cancel, style: "cancel" },
      {
        text: t.confirm,
        style: "destructive",
        onPress: () => {
          reset();
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        },
      },
    ]);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const counterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  const burstStyle = useAnimatedStyle(() => ({
    opacity: glowBurst.value * 0.6,
    transform: [{ scale: 1 + glowBurst.value * 0.4 }],
  }));

  const bgColor1 = isGolden ? "#10050033" : colors.emeraldDark;
  const bgColor2 = isGolden ? "#2D1500" : colors.emerald;
  const bgColor3 = isGolden ? "#1A0A00" : "#011a12";

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[bgColor1, bgColor2, bgColor3]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
      />

      {plusOnes.map((item) => (
        <FloatingPlusOne
          key={item.id}
          id={item.id}
          x={item.x}
          y={item.y}
          onComplete={removePlusOne}
          isArabic={isArabic}
        />
      ))}

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop:
              insets.top + 16 + (Platform.OS === "web" ? 67 : 0),
            paddingBottom:
              insets.bottom + 100 + (Platform.OS === "web" ? 34 : 0),
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View
          style={[
            styles.header,
            { flexDirection: isArabic ? "row-reverse" : "row" },
          ]}
        >
          <View>
            <Text
              style={[
                styles.appName,
                {
                  color: colors.gold,
                  fontFamily: isArabic ? "Amiri_700Bold" : "Inter_700Bold",
                  textAlign: isArabic ? "right" : "left",
                  ...(Platform.OS !== "web"
                    ? {
                        textShadowColor: "rgba(212,175,55,0.4)",
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 16,
                      }
                    : { textShadow: "0 0 16px rgba(212,175,55,0.4)" }),
                },
              ]}
            >
              {t.appName}
            </Text>
            <Text
              style={[
                styles.appSubtitle,
                {
                  color: colors.textSecondary,
                  fontFamily: isArabic ? "Amiri_400Regular" : "Inter_400Regular",
                  textAlign: isArabic ? "right" : "left",
                },
              ]}
            >
              {t.appSubtitle}
            </Text>
          </View>
          <Pressable
            onPress={toggleLanguage}
            style={({ pressed }) => [
              styles.langBtn,
              {
                backgroundColor: colors.glass,
                borderColor: colors.glassBorderLight,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Text
              style={[
                styles.langText,
                { color: colors.gold, fontFamily: "Inter_600SemiBold" },
              ]}
            >
              {t.language}
            </Text>
          </Pressable>
        </View>

        <GlassCard style={styles.countCard} shimmer intense>
          <Text
            style={[
              styles.countLabel,
              {
                color: colors.textSecondary,
                fontFamily: isArabic ? "Amiri_400Regular" : "Inter_400Regular",
                textAlign: "center",
              },
            ]}
          >
            {t.totalSalawat}
          </Text>
          <Animated.Text
            style={[
              styles.countNumber,
              {
                color: colors.gold,
                fontFamily: isArabic ? "Amiri_700Bold" : "Inter_700Bold",
                ...(Platform.OS !== "web"
                  ? {
                      textShadowColor: "rgba(212,175,55,0.5)",
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 24,
                    }
                  : { textShadow: "0 0 24px rgba(212,175,55,0.5)" }),
              },
              counterStyle,
            ]}
          >
            {formattedCount}
          </Animated.Text>

          {nextMilestone && (
            <View style={styles.progressWrap}>
              <View
                style={[
                  styles.progressBg,
                  { backgroundColor: "rgba(255,255,255,0.09)" },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.gold,
                      width: `${Math.round(progress * 100)}%`,
                    },
                  ]}
                />
                <LinearGradient
                  colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 3 }]}
                />
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "Inter_400Regular",
                  },
                ]}
              >
                {nextMilestone.toLocaleString()} {t.times}
              </Text>
            </View>
          )}
        </GlassCard>

        <View style={styles.buttonArea}>
          <PulsingGlow color={colors.gold} />

          <Animated.View style={[styles.burstRing, { backgroundColor: colors.goldLight }, burstStyle]} />

          <Animated.View style={buttonStyle}>
            <Pressable onPress={handlePress}>
              <LinearGradient
                colors={
                  isGolden
                    ? ["#FFE44D", "#FFD700", "#CCA800", "#FFD700"]
                    : [colors.goldLight, colors.gold, colors.goldDim, colors.gold]
                }
                locations={[0, 0.3, 0.7, 1]}
                style={styles.haloBtn}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.3)", "transparent", "rgba(0,0,0,0.1)"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0.3, y: 0 }}
                  end={{ x: 0.7, y: 1 }}
                />
                <MaterialCommunityIcons
                  name="star-crescent"
                  size={54}
                  color={colors.emeraldDark}
                />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <Text
          style={[
            styles.tapHint,
            {
              color: colors.textSecondary,
              fontFamily: isArabic ? "Amiri_400Regular" : "Inter_400Regular",
            },
          ]}
        >
          {t.tapToCount}
        </Text>

        <GlassCard style={styles.salawatCard} shimmer>
          <Text
            style={[
              styles.salawatArabic,
              {
                color: colors.gold,
                fontFamily: "Amiri_700Bold",
              },
            ]}
          >
            {t.salawatFormula}
          </Text>
          <LinearGradient
            colors={["transparent", colors.goldDim, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.salawatDivider}
          />
          <Text
            style={[
              styles.salawatTranslation,
              {
                color: colors.textSecondary,
                fontFamily: isArabic ? "Amiri_400Regular" : "Inter_400Regular",
              },
            ]}
          >
            {t.salawatTranslation}
          </Text>
        </GlassCard>

        <Pressable
          onPress={confirmReset}
          style={({ pressed }) => [
            styles.resetBtn,
            {
              borderColor: colors.glassBorder,
              opacity: pressed ? 0.6 : 0.8,
              backgroundColor: pressed ? "rgba(255,255,255,0.04)" : "transparent",
            },
          ]}
        >
          <Ionicons name="refresh" size={14} color={colors.textSecondary} />
          <Text
            style={[
              styles.resetText,
              {
                color: colors.textSecondary,
                fontFamily: "Inter_400Regular",
              },
            ]}
          >
            {t.reset}
          </Text>
        </Pressable>
      </ScrollView>

      <MilestoneModal
        visible={milestoneVisible}
        count={milestoneCount}
        isGoldenUnlock={isGoldenUnlock}
        onClose={() => setMilestoneVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 22,
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  appName: {
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  appSubtitle: {
    fontSize: 13,
    marginTop: 3,
    opacity: 0.75,
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
  },
  langText: { fontSize: 13, fontWeight: "600" },
  countCard: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    gap: 6,
  },
  countLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  countNumber: {
    fontSize: 68,
    fontWeight: "700",
    letterSpacing: -2,
  },
  progressWrap: {
    width: "100%",
    alignItems: "center",
    gap: 7,
    marginTop: 10,
  },
  progressBg: {
    width: "100%",
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    opacity: 0.65,
  },
  buttonArea: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  burstRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  haloBtn: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tapHint: {
    fontSize: 14,
    letterSpacing: 0.2,
    opacity: 0.7,
    marginTop: -6,
  },
  salawatCard: {
    width: "100%",
    alignItems: "center",
    gap: 14,
    paddingVertical: 26,
  },
  salawatArabic: {
    fontSize: 22,
    textAlign: "center",
    lineHeight: 40,
  },
  salawatDivider: {
    width: 80,
    height: 1,
    opacity: 0.6,
  },
  salawatTranslation: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 8,
  },
  resetText: { fontSize: 13 },
});
