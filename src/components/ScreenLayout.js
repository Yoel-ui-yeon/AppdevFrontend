import { Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useResponsive from '../hooks/useResponsive';
import { COLORS, IMG, SPACING } from '../utils';

const ScreenLayout = ({
  children,
  title,
  subtitle,
  scroll = true,
  headerRight,
  showLogo = false,
  refreshing = false,
  onRefresh,
}) => {
  const { contentMaxWidth } = useResponsive();

  const content = (
    <>
      {(title || showLogo) && (
        <View style={styles.header}>
          {showLogo && (
            <Image source={IMG.SECONDARY_LOGO} style={styles.logo} resizeMode="contain" />
          )}
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {headerRight}
        </View>
      )}
      {children}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            ) : undefined
          }
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.scroll}>{content}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.lightBg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  header: { marginBottom: SPACING.lg, alignItems: 'center' },
  logo: { width: 72, height: 72, marginBottom: SPACING.sm },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDark,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
});

export default ScreenLayout;
