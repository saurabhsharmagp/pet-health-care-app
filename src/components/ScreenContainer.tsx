import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export default function ScreenContainer({ children, scroll = true, style }: Props) {
  const Wrapper = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Wrapper
        style={scroll ? styles.scroll : styles.flex}
        contentContainerStyle={scroll ? [styles.content, style] : undefined}
        showsVerticalScrollIndicator={false}
      >
        {!scroll ? <View style={[styles.flex, style]}>{children}</View> : children}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
