const User = require('./User');
const Item = require('./Item');
const ItemRate = require('./ItemRate');
const ItemImage = require('./ItemImage');
const ItemBought = require('./ItemBought');
const ItemFavorite = require('./ItemFavorite');
const ItemCharacteristics = require('./ItemCharacteristics');
const Company = require('./Company');
const Genre = require('./Genre');
const Publication = require('./Publication');
const PublicationTag = require('./PublicationTag');
const PublicationComment = require('./PublicationComment');

function initModels() {
    User.hasMany(ItemBought, {foreignKey: 'userId'});
    ItemBought.belongsTo(User, {foreignKey: 'userId'});

    User.hasMany(ItemFavorite, {foreignKey: 'userId'});
    ItemFavorite.belongsTo(User, {foreignKey: 'userId'});

    User.hasMany(ItemRate, {foreignKey: 'userId'});
    ItemRate.belongsTo(User, {foreignKey: 'userId'});

    Item.hasMany(ItemBought, {foreignKey: 'itemId'});
    ItemBought.belongsTo(Item, {foreignKey: 'itemId'});

    Item.hasMany(ItemFavorite, {foreignKey: 'itemId'});
    ItemFavorite.belongsTo(Item, {foreignKey: 'itemId'});

    Item.hasMany(ItemRate, {foreignKey: 'itemId'});
    ItemRate.belongsTo(Item, {foreignKey: 'itemId'});

    Item.hasMany(ItemImage, {foreignKey: 'itemId', onDelete: 'CASCADE'});
    ItemImage.belongsTo(Item, {foreignKey: 'itemId'});

    Item.hasMany(ItemCharacteristics, {foreignKey: 'itemId', onDelete: 'CASCADE'});
    ItemCharacteristics.belongsTo(Item, {foreignKey: 'itemId'});

    Company.hasMany(Item, {foreignKey: 'companyId'});
    Item.belongsTo(Company, {foreignKey: 'companyId'});

    Genre.hasMany(Item, {foreignKey: 'genreId'});
    Item.belongsTo(Genre, {foreignKey: 'genreId'});

    Publication.hasMany(PublicationComment, {foreignKey: 'publicationId'});
    PublicationComment.belongsTo(Publication, {foreignKey: 'publicationId'});

    Publication.hasMany(PublicationTag, {foreignKey: 'publicationId'});
    PublicationTag.belongsTo(Publication, {foreignKey: 'publicationId'});

    User.hasMany(Publication, {foreignKey: 'userId'});
    Publication.belongsTo(User, {foreignKey: 'userId'});

    User.hasMany(PublicationComment, {foreignKey: 'userId'});
    PublicationComment.belongsTo(User, {foreignKey: 'userId'});
}

export default initModels;
export {User, Item, ItemRate, ItemImage, ItemBought, ItemFavorite, ItemCharacteristics, Company, Genre, Publication, PublicationTag, PublicationComment};