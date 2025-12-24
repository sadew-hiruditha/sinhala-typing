import { useMemo, useState } from "react";
import { useFeatureSupport } from "@canva/app-hooks";
import { Button, Rows, Text, Title, Select } from "@canva/app-ui-kit";
import { addElementAtCursor, addElementAtPoint } from "@canva/design";
import { FormattedMessage, useIntl } from "react-intl";
import {
  singlishToUnicode,
  unicodeToDlManel,
  dlManelToUnicode,
} from "sinhala-unicode-coverter";
import * as styles from "styles/components.css";

type InsertMode = "unicode" | "dl_manel_legacy";

export const App = () => {
  const intl = useIntl();
  const isSupported = useFeatureSupport();
  const addElement = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );

  const [roman, setRoman] = useState("");
  const [mode, setMode] = useState<InsertMode>("unicode");

  // Optional: if user pastes legacy text and wants to convert back to Unicode
  const [legacyInput, setLegacyInput] = useState("");

  const unicode = useMemo(() => singlishToUnicode(roman), [roman]);

  const legacyDlManel = useMemo(() => {
    // Convert the Unicode result into DL-Manel legacy encoding
    return unicodeToDlManel(unicode);
  }, [unicode]);

  const legacyToUnicode = useMemo(() => {
    if (!legacyInput.trim()) return "";
    return dlManelToUnicode(legacyInput);
  }, [legacyInput]);

  const insertText = () => {
    if (!addElement) return;

    const textToInsert =
      mode === "unicode" ? unicode.trim() : legacyDlManel.trim();

    if (!textToInsert) return;

    addElement({
      type: "text",
      children: [textToInsert],
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Title>
          {intl.formatMessage({
            defaultMessage: "Sinhala Typing (Phonetic)",
          })}
        </Title>

        <Text>
          <FormattedMessage
            defaultMessage="Type Singlish. We convert it to Sinhala. Choose how to insert into Canva."
          />
        </Text>

        <Rows spacing="1u">
          <Text>
            {intl.formatMessage({ defaultMessage: "Insert mode" })}
          </Text>
          <Select
            value={mode}
            onChange={(value) => setMode(value as InsertMode)}
            options={[
              {
                label: intl.formatMessage({
                  defaultMessage: "Unicode (recommended)",
                }),
                value: "unicode",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "DL-Manel legacy (font-locked)",
                }),
                value: "dl_manel_legacy",
              },
            ]}
          />
          {mode === "dl_manel_legacy" ? (
            <Text>
              {intl.formatMessage({
                defaultMessage:
                  "Legacy text only works if you apply the DL-Manel font in Canva. Changing fonts will break it.",
              })}
            </Text>
          ) : null}
        </Rows>

        <Rows spacing="1u">
          <Text>{intl.formatMessage({ defaultMessage: "Singlish input" })}</Text>
          <textarea
            value={roman}
            onChange={(e) => setRoman(e.currentTarget.value)}
            rows={4}
            placeholder="shrii lankaawa..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d9d9d9",
              fontSize: "14px",
            }}
          />
        </Rows>

        <Rows spacing="1u">


          <Text>
            {intl.formatMessage({
              defaultMessage: "Unicode output",
            })}
          </Text>
          <div className={styles.legacyPreview}>
            {legacyDlManel || "fmroiqk fuys Èiajkq we;'"}
          </div>



        </Rows>

        <Rows spacing="1u">
          <Text>
            {intl.formatMessage({
              defaultMessage: "DL-Manel legacy output",
            })}
          </Text>
          <textarea
            value={legacyDlManel}
            readOnly
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d9d9d9",
              fontSize: "14px",
            }}
          />
        </Rows>

        <Button
          variant="primary"
          onClick={insertText}
          disabled={!addElement || !(mode === "unicode" ? unicode.trim() : legacyDlManel.trim())}
          stretch
        >
          {intl.formatMessage({ defaultMessage: "Insert into design" })}
        </Button>

        <Button
          variant="secondary"
          onClick={() => setRoman("")}
          disabled={!roman}
          stretch
        >
          {intl.formatMessage({ defaultMessage: "Clear" })}
        </Button>

       
      </Rows>
    </div>
  );
};
