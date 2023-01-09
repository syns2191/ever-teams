import React, { FC, useEffect, useState } from "react";
import { View, ScrollView, Text, ViewStyle, TextStyle, Dimensions } from "react-native";
import { Screen } from "../../../components";
import { useStores } from "../../../models";
import { AuthenticatedDrawerScreenProps } from "../../../navigators/AuthenticatedNavigator";
import { colors, typography } from "../../../theme";
import LanguageModal, { ISupportedLanguage, supportedLanguages } from "./components/LanguageModal";
import PictureSection from "./components/PictureSection";
import SectionTab from "./components/SectionTab";
import SettingHeader from "./components/SettingHeader";
import SingleInfo from "./components/SingleInfo";
import { BlurView } from "expo-blur";
import { translate } from "../../../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const AuthenticatedSettingScreen: FC<AuthenticatedDrawerScreenProps<"Setting">> = function AuthenticatedDrawerScreen(_props) {
    const {
        authenticationStore: { user },
        teamStore: { activeTeam }
    } = useStores();

    // STATES
    const [activeTab, setActiveTab] = useState(1)
    const [languageModal, setLanguageModal] = useState(false)
    const [lang, setLang] = useState<ISupportedLanguage>(supportedLanguages[2])

    const setLanguageLabel = async () => {
        const localCode = await AsyncStorage.getItem("Language");
        if (!localCode) {
            const language = supportedLanguages.find((l) => l.localeCode === "en");
            setLang(language)
        } else {
            const language = supportedLanguages.find((l) => l.localeCode === localCode);
            setLang(language)
        }
    }

    useEffect(() => {
        setLanguageLabel();
    }, [])
    return (
        <>
            {languageModal && <BlurView tint="dark" intensity={18} style={$blurContainer} />}
            <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
                <LanguageModal visible={languageModal} currentLanguage={lang.locale} onDismiss={() => setLanguageModal(false)} />
                <View style={$headerContainer}>
                    <SettingHeader {..._props} />
                    <SectionTab activeTabId={activeTab} toggleTab={setActiveTab} />
                </View>
                <ScrollView>
                    {activeTab === 1 ?
                        // PERSONAL SECTION CONTENT STARTS HERE
                        <View style={$contentContainer}>
                            <PictureSection
                                imageUrl={user?.imageUrl}
                                buttonLabel={translate("settingScreen.personalSection.changeAvatar")}
                                onDelete={() => { }}
                                onChange={() => { }}
                            />
                            <SingleInfo title={translate("settingScreen.personalSection.fullName")} value={user?.name} />
                            <SingleInfo title={translate("settingScreen.personalSection.yourContact")} value={translate("settingScreen.personalSection.yourContactHint")} />
                            <SingleInfo title={translate("settingScreen.personalSection.themes")} value={translate("settingScreen.personalSection.lightModeToDark")} />
                            <SingleInfo onPress={() => setLanguageModal(true)} title={translate("settingScreen.personalSection.language")} value={lang.locale} />
                            <SingleInfo title={translate("settingScreen.personalSection.timeZone")} value={"Eastern Time Zone (UTC-05:00)"} />
                            <SingleInfo title={translate("settingScreen.personalSection.workSchedule")} value={translate("settingScreen.personalSection.workScheduleHint")} />

                            <View style={$dangerZoneContainer}>
                                <Text style={$dangerZoneTitle}>{translate("settingScreen.dangerZone")}</Text>
                                <SingleInfo title={translate("settingScreen.personalSection.removeAccount")} value={translate("settingScreen.personalSection.removeAccountHint")} />
                                <SingleInfo title={translate("settingScreen.personalSection.deleteAccount")} value={translate("settingScreen.personalSection.deleteAccountHint")} />
                            </View>
                        </View>
                        // PERSONAL SECTION CONTENT ENDS HERE
                        :
                        // TEAM SECTION CONTENT STARTS HERE
                        <View style={$contentContainer}>
                            <PictureSection
                                imageUrl={""}
                                buttonLabel={translate("settingScreen.teamSection.changeLogo")}
                                onDelete={() => { }}
                                onChange={() => { }}
                            />
                            <SingleInfo title={translate("settingScreen.teamSection.teamName")} value={activeTeam?.name} />
                            <SingleInfo title={translate("settingScreen.teamSection.timeTracking")} value={translate("settingScreen.teamSection.timeTrackingHint")} />
                            <SingleInfo title={translate("settingScreen.teamSection.taskPriorities")} value={"there are 4 active priorities"} />
                            <SingleInfo title={translate("settingScreen.teamSection.taskSizes")} value={"there are 5 active sizes"} />
                            <SingleInfo title={translate("settingScreen.teamSection.taskLabel")} value={"there are 8 active label"} />
                            <SingleInfo title={translate("settingScreen.teamSection.teamRole")} value={"No"} />
                            <SingleInfo title={translate("settingScreen.teamSection.workSchedule")} value={translate("settingScreen.teamSection.workScheduleHint")} />

                            <View style={$dangerZoneContainer}>
                                <Text style={$dangerZoneTitle}>{translate("settingScreen.dangerZone")}</Text>
                                <SingleInfo title={translate("settingScreen.teamSection.transferOwnership")} value={translate("settingScreen.teamSection.transferOwnership")} />
                                <SingleInfo title={translate("settingScreen.teamSection.removeTeam")} value={translate("settingScreen.teamSection.removeTeamHint")} />
                                <SingleInfo title={translate("settingScreen.teamSection.quitTeam")} value={translate("settingScreen.teamSection.quitTeamHint")} />
                            </View>
                        </View>
                        // TEAM SECTION CONTENT ENDS HERE
                    }
                </ScrollView>
            </Screen>
        </>

    )
}

const { height, width } = Dimensions.get("window");

const $container: ViewStyle = {
    flex: 1,
    paddingBottom: 50
}

const $headerContainer: ViewStyle = {
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 32,
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 1.00,
    elevation: 1,
    zIndex: 10
}

const $blurContainer: ViewStyle = {
    // flex: 1,
    height: height,
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1001
}

const $contentContainer: ViewStyle = {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#fff",
}

const $dangerZoneContainer: ViewStyle = {
    borderTopColor: "rgba(0, 0, 0, 0.09)",
    borderTopWidth: 1,
    paddingTop: 32,
    marginTop: 32
}
const $dangerZoneTitle: TextStyle = {
    color: "#DA5E5E",
    fontSize: 20,
    fontFamily: typography.primary.semiBold
}