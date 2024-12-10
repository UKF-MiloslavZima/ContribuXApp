import React from "react";
import { Image, View, Pressable } from "react-native";

import Badge from "../Badge/Badge";
import Header from "../Header/Header";

import style from "./style";
import PropTypes from "prop-types";

const Item = props => {
    return (
        <Pressable
            onPress={() => {
                props.onPress(props.donationItemId);
            }} >
            <View>
                <View style={style.badge}>
                    <Badge title={props.badgeTitle} />
                </View>
                <Image
                    resizeMode={'cover'}
                    source={{ uri: props.uri }}
                    style={style.image}
                />
            </View>
            <View style={style.itemInformation}>
                <Header
                    title={props.donationTitle}
                    type={3}
                    color={'#0A043C'}
                    numberOfLines={1}
                />
                <View style={style.price}>
                    <Header
                        title={"$" + props.price.toFixed(2)}
                        type={3}
                        color={"#156CF7"}
                    />
                </View>
            </View>
        </Pressable>
    );
};

Item.defaultProps = {
    onPress: () => { },
};

Item.propTypes = {
    donationItemId: PropTypes.number.isRequired,
    uri: PropTypes.string.isRequired,
    badgeTitle: PropTypes.string.isRequired,
    donationTitle: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    onPress: PropTypes.func,
};

export default Item;