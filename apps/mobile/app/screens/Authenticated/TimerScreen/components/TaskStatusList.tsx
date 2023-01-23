import React, { FC, useEffect } from "react"
import { View, StyleSheet, Image, TouchableOpacity } from "react-native"
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons"
import { ITaskStatus, ITeamTask } from "../../../../services/interfaces/ITask"

// COMPONENTS
import { Text } from "../../../../components"
import { useStores } from "../../../../models"
import { observer } from "mobx-react-lite"


// STYLES
import { GLOBAL_STYLE as GS } from "../../../../../assets/ts/styles"
import { typography } from "../../../../theme"
import { BadgedTaskStatus } from "../../../../components/StatusIcon"
import { useTeamTasks } from "../../../../services/hooks/features/useTeamTasks"
import { useAppTheme } from "../../../../app"
import { showMessage } from "react-native-flash-message"

export interface Props {
    onDismiss: () => unknown;
}

const TaskStatusList: FC<Props> = observer(({ onDismiss }) => {
    const { updateTask } = useTeamTasks();
    const { colors } = useAppTheme()
    const {
        TaskStore: { activeTask, setActiveTask },
    } = useStores();

    const statusList: ITaskStatus[] = ["Todo", "In Progress", "For Testing", "Completed", "Unassigned", "In Review", "Closed"]

    const OnItemPressed = (text) => {
        onChangeStatus(text);
        onDismiss();
    }

    const onChangeStatus = async (text) => {
        const value: ITaskStatus = text;
        const task: ITeamTask = {
            ...activeTask,
            status: value
        };

        const { response } = await updateTask(task, task.id);

        if (response.status === 202 || response.status === 200 || response.status === 201) {
            setActiveTask(task)
            showMessage({
                message: "Update success",
                type: "success"
            })
        }
    }

    return (
        <View style={[styles.dropdownContainer, { backgroundColor: colors.background }]}>
            {statusList.map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.dropdownItem} onPress={() => OnItemPressed(item)}>
                    <BadgedTaskStatus status={item} showColor={false} />
                </TouchableOpacity>
            ))}
        </View>
    )
})

export default TaskStatusList

const styles = StyleSheet.create({
    dropdownContainer: {
        position: "absolute",
        paddingHorizontal: 5,
        top: 37,
        width: "100%",
        minWidth: 135,
        borderRadius: 5,
        zIndex: 1000,
        ...GS.noBorder,
        borderWidth: 1,
        elevation: 10,
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 10, height: 10.5 },
        shadowOpacity: 1,
        shadowRadius: 15,
    },
    dropdownItem: {
        paddingVertical: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    dropdownItemTxt: {
        fontFamily: typography.fonts.PlusJakartaSans.semiBold,
        fontSize: 10

    },
    iconStyle: {
        width: 12,
        height: 12,
        marginRight: 5,
    },
})