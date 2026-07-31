import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  initial: string;
  color: string;
  size?: number;
  uri?: string;
};

export default function Avatar({ initial, color, size = 48, uri }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + '22',
        },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={[styles.text, { color, fontSize: size * 0.42 }]}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: '700',
  },
});
