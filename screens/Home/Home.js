import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    Image,
    Pressable,
    FlatList,
} from 'react-native';

// Importing the useSelector and useDispatch hooks from the React Redux library
// The useSelector hook allows us to select and retrieve data from the store
// The useDispatch hook allows us to dispatch actions to update the store
import { useDispatch, useSelector } from "react-redux";

import Header from "../../components/Header/Header";
import Tab from "../../components/Tab/Tab";
import Search from "../../components/Search/Search";
import Item from "../../components/Item/Item";


import { Routes } from '../../navigation/Routes';

import { updateSelectedCategoryId } from '../../redux/reducers/Categories';
import { updateSelectedDonationId } from '../../redux/reducers/Donations';
import { resetToInitialState } from '../../redux/reducers/User';
import { logOut } from '../../api/user';


import globalStyle from "../../assets/styles/globalStyle";
import style from "./style";

const Home = ({ navigation }) => {
    const user = useSelector(state => state.user);

    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories);
    const donations = useSelector(state => state.donations);

    const [donationItems, setDonationItems] = useState([]);
    const [categoryPage, setCategoryPage] = useState(1);
    const [categoryList, setCategoryList] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const categoryPageSize = 4;

    useEffect(() => {
        const items = donations.items.filter(value =>
            value.categoryIds.includes(categories.selectedCategoryId),
        );
        setDonationItems(items);
    }, [categories.selectedCategoryId]);

    useEffect(() => {
        setIsLoadingCategories(true);
        setCategoryList(
            pagination(categories.categories, categoryPage, categoryPageSize),
        );
        setCategoryPage(prev => prev + 1);
        setIsLoadingCategories(false);
    }, []);

    const pagination = (items, pageNumber, pageSize) => {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        if (startIndex >= items.length) {
            return [];
        }
        return items.slice(startIndex, endIndex);
    };


    return (
        <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={style.header}>
                    <View>
                        <Text style={style.headerIntroText}>Hello, </Text>
                        <View style={style.username}>
                            <Header title={user.displayName + ' 👋'} />
                        </View>
                    </View>
                    <View>
                        <Image
                            source={require('../../assets/images/profile_image.png')}
                            style={style.profileImage}
                            resizeMode={'contain'}
                        />
                        <Pressable
                            onPress={async () => {
                                dispatch(resetToInitialState());
                                await logOut();
                            }}>
                            <Header type={3} title={'Logout'} color={'#156CF7'} />
                        </Pressable>
                    </View>
                </View>
                <View style={style.searchBox}>
                    <Search />
                </View>
                <Pressable style={style.highlightedImageContainer}>
                    <Image
                        style={style.highlightedImage}
                        source={require('../../assets/images/highlighted_image.png')}
                        resizeMode={'contain'}
                    />
                </Pressable>
                <View style={style.categoryHeader}>
                    <Header title={'Select Category'} type={2} />
                </View>
                <View style={style.categories}>
                    <FlatList
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            if (isLoadingCategories) {
                                return;
                            }
                            setIsLoadingCategories(true);
                            let newData = pagination(
                                categories.categories,
                                categoryPage,
                                categoryPageSize,
                            );
                            if (newData.length > 0) {
                                setCategoryList(prevState => [...prevState, ...newData]);
                                setCategoryPage(prevState => prevState + 1);
                            }
                            setIsLoadingCategories(false);
                        }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={categoryList}
                        renderItem={({ item }) => (
                            <View style={style.categoryItem} key={item.categoryId}>
                                <Tab
                                    tabId={item.categoryId}
                                    onPress={value => dispatch(updateSelectedCategoryId(value))}
                                    title={item.name}
                                    isInactive={item.categoryId !== categories.selectedCategoryId}
                                />
                            </View>
                        )}
                    />
                </View>
                {donationItems.length > 0 && (
                    <View style={style.donationItemsContainer}>
                        {donationItems.map(value => {
                            const categoryInformation = categories.categories.find(
                                val => val.categoryId === categories.selectedCategoryId,
                            );
                            return (
                                <View
                                    key={value.donationItemId}
                                    style={style.singleItem}>
                                    <Item
                                        onPress={selectedDonationId => {
                                            dispatch(updateSelectedDonationId(selectedDonationId));
                                            navigation.navigate(Routes.SingleItem, {
                                                categoryInformation,
                                            });
                                        }}
                                        donationItemId={value.donationItemId}
                                        uri={value.image}
                                        donationTitle={value.name}
                                        badgeTitle={categoryInformation.name}
                                        price={parseFloat(value.price)}
                                    />
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView >
    );
};

export default Home;