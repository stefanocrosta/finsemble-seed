/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
*/
import React, { Component } from "react";

//components
import Toast from './Toast';
// import Tag from './Tag';
import Tag from '../../../shared/Tag';
import TagsMenu from '../../../shared/TagsMenu';

/**
 * The search bar, tags filter menu, and any active tage being filtered on
 * @param {object} props Component props
 * @param {boolean} props.backButton If true, display a back button for going back to the homepage
 * @param {array} props.tags An array of all available tags for the tags menu
 * @param {array} props.activeTags An array of active tags acting as search criteria
 * @param {func} props.tagSelected Parent function for adding an active tag to search
 * @param {func} props.removeTag Parent function for removing an active tag from search
 * @param {func} props.goHome Function to handle sending the app back to the homepage
 * @param {func} props.changeSearch Function to handle when the search text is changed
 * @param {func} props.installationActionTaken Function that handles display/hiding the success/failure message from adding/removing an app
 */
class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchValue: "",
			tagSelectorOpen: false
		};
		this.bindCorrectContext();
	}
	bindCorrectContext() {
		this.changeSearch = this.changeSearch.bind(this);
		this.toggleTagSelector = this.toggleTagSelector.bind(this);
		this.selectTag = this.selectTag.bind(this);
		this.removeTag = this.removeTag.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeTags.length === 0 && !nextProps.backButton) {
			this.setState({
				searchValue: ""
			});
		}
	}
	/**
	 * Handles changing the component state for handling local input value. Also calls parent function to effect the store
	 * @param {object} e React Synthetic event
	 */
	changeSearch(e) {
		this.setState({
			searchValue: e.target.value
		});
		this.props.changeSearch(e.target.value);
	}
	/**
	 * Opens/hides the tag selection menu
	 */
	toggleTagSelector() {
		this.setState({
			tagSelectorOpen: !this.state.tagSelectorOpen
		});
	}
	/**
	 * Calls parent function to add a tag to filters
	 * @param {string} tag The name of the tag
	 */
	selectTag(tag) {
		this.setState({
			tagSelectorOpen: false
		}, () => {
			this.props.tagSelected(tag)
		});
	}
	/**
	 * Calls parent function to remove a tag from filters
	 * @param {string} tag The name of the tag
	 */
	removeTag(tag) {
		const callParent = () => {
			this.props.removeTag(tag);
		}

		if (this.props.activeTags.length <= 1) {
			this.setState({
				searchValue: ""
			}, callParent);
		} else {
			callParent();
		}
	}
	render() {

		let tagListClass = "tag-selector-content";
		if (!this.state.tagSelectorOpen) {
			tagListClass += " hidden";
		}

		return (
			<div className='search-main'>
				<Toast installationActionTaken={this.props.installationActionTaken} />
				<div className="search-action-items">
					{this.props.backButton ?
						<div className='search-back' onClick={this.props.goHome}>
							<i className='ff-arrow-back'></i>
							<span className='button-label'>Back</span>
						</div> : null}
					<div className="search-input-container">
						<i className='ff-search'></i>
						<input className='search-input' type="text" value={this.state.searchValue} onChange={this.changeSearch} />
					</div>
					<TagsMenu list={this.props.tags} onItemClick={this.selectTag} label={"Tags"} align='right' />
				</div>
				<div className='label-bar'>
					{this.props.activeTags.map((tag, i) => {
						return (
							<Tag key={tag} name={tag} removeTag={this.removeTag} />
						);
					})}
				</div>
			</div>
		);
	}
}

export default SearchBar;