import React, { useState, useRef, useEffect } from 'react';
import {
	StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal, TextInput, ActivityIndicator,
	PermissionsAndroid
} from 'react-native';

const { width, height } = Dimensions.get("window");
import DocumentScanner from "react-native-document-scanner";
import AsyncStorage from '@react-native-async-storage/async-storage';

function YourComponent({ navigation }) {
	const [info, setInfo] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [savePopup, setSavePopup] = useState(false);
	const [fileName, setFileName] = useState("");
	const docRef = useRef();

	const cancelSelection = () => {
		setInfo({});
	}



	const triggerSave = () => {
		// save info.image
		// ask user for fileName
		setSavePopup(true);
	}

	const saveDoc = async () => {
		setSavePopup(false);
		setIsLoading(true);
		const toSave = {
			fileName: fileName,
			docPath: info.image
		};
		// display spinner 
		await AsyncStorage.setItem(toSave.fileName, toSave.docPath, () => {
			setIsLoading(false);
			navigation.goBack();
		}, (error) => {
			setIsLoading(false);
		});
	}


	const fileInputModal = (
		<Modal
			animationType={'fade'}
			transparent={true}
			visible={savePopup}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<View>
						<Text style={styles.titleText}>Rename the image</Text>
					</View>
					<View>
						<Text style={styles.dextext}>Are you sure to remane this content? You cannot change the name of the file ever again.</Text>
					</View>
					<TextInput
						value={fileName}
						onChangeText={text => setFileName(text)}
						style={styles.inputStyle}
					/>
					<View style={{ marginVertical: 10, flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => setSavePopup(false)} style={styles.closeButton}>
							<Text style={styles.cancelText}>Close</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={saveDoc} style={styles.saveButton} disabled={fileName == ""}>
							<Text style={styles.saveText}>Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
	return (

		<View style={{ flex: 1, backgroundColor: 'white' }}>
			{
				(info.image) ?
					<>
						<Image
							source={{ uri: info.image}}
							resizeMode="contain"
							style={{ flex: 1, backgroundColor: '#e8e8e8' }}
						/>
						{fileInputModal}
						<View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between', marginHorizontal: 20 }}>
							<TouchableOpacity onPress={cancelSelection} style={styles.closeButton}>
								<Text style={styles.cancelText}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={triggerSave} style={styles.saveButton}>
								<Text style={styles.saveText}>Save</Text>
							</TouchableOpacity>
						</View>
					</>
					:
					<>
						<DocumentScanner
							ref={docRef}
							style={{ flex: 1, backgroundColor: 'white' }}
							useBase64={true}
							saveInAppDocument={false}
							onPictureTaken={data => {
								console.log(data.croppedImage.replace("file://",""))
								setInfo({
									image: data.croppedImage,
									initialImage: data.initialImage,
									rectangleCoordinates: data.rectangleCoordinates,
									imageHeight: data.height,
									imageWidth: data.width
								})
							}
							}
							overlayColor="rgba(255,130,0, 0.7)"
							enableTorch={false}
							brightness={0.3}
							saturation={1}
							contrast={1.1}
							quality={0.5}
							detectionCountBeforeCapture={5}
							detectionRefreshRateInMS={50}
							onPermissionsDenied={() => console.log("Permissions Denied")}
						/>

					</>
			}
			{
				isLoading &&
				<View style={{ position: 'absolute', width: width, height: height, backgroundColor: 'rgba(52, 52, 52, 0.4)', alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator size={'large'} color={'green'} />
				</View>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
	scanner: {
		flex: 1,
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(224,224,224,0.5)',
	},
	modalView: {
		backgroundColor: '#fff',
		borderRadius: 18,
		paddingHorizontal: 10,
		width: width - 70,
	},
	inputStyle: {
		height: 50,
		borderColor: 'gray',
		borderWidth: 0.25,
		fontSize: 16,
		backgroundColor: 'white',
		borderRadius: 20,
		paddingHorizontal: 10,
		color: '#696969'
	},
	closeButton: {
		borderRadius: 10,
		//borderWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 10,
		alignItems: 'center',
		flex: 1,

		backgroundColor: '#ededed',
		marginRight: 10,
		//borderColor: '#9E9E9E'
	},
	saveButton: {
		flex: 1,
		borderRadius: 10,
		borderWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 10,
		alignItems: 'center',
		backgroundColor: '#2266EE',
		borderColor: "#2266EE"
	},
	titleText: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'left',
		marginTop: 10,
		paddingHorizontal: 10,
		marginBottom: 10
	},
	dextext: {
		fontSize: 12,
		//fontWeight: 'bold',
		textAlign: 'left',
		marginTop: 10,
		color: '#696969',
		paddingHorizontal: 10,
		marginBottom: 20
	},
	saveText: {
		fontSize: 14, fontWeight: 'bold', color: 'white'
	},
	cancelText: {
		fontSize: 14, fontWeight: 'bold', color: '#696969'
	}
});

export default YourComponent;
